"""
Search API Service - 支持 Bing/Google 格式的搜索引擎接口
"""
import os
import json
import urllib.request
import urllib.parse
from typing import Dict, List, Any, Optional

class SearchAPI:
    """
    统一搜索API，支持 Bing/Google 格式
    """
    
    def __init__(self):
        self.enabled = True
        self.provider = "bing"  # 默认 Bing
        self.api_keys = {
            'bing': os.environ.get('BING_API_KEY', ''),
            'google': os.environ.get('GOOGLE_API_KEY', '')
        }
    
    def enable(self):
        self.enabled = True
    
    def disable(self):
        self.enabled = False
    
    def is_enabled(self) -> bool:
        return self.enabled
    
    def set_provider(self, provider: str):
        """设置搜索提供商: bing | google"""
        if provider in ['bing', 'google']:
            self.provider = provider
    
    def get_provider(self) -> str:
        return self.provider
    
    # ==================== Bing Search API ====================
    
    def bing_search(self, query: str, count: int = 10, offset: int = 0, 
                   market: str = "zh-CN", safeSearch: str = "Moderate",
                   responseFilter: str = "") -> Dict[str, Any]:
        """
        Bing Search API v7 格式
        
        Args:
            query: 搜索关键词
            count: 返回数量 (1-50)
            offset: 偏移量
            market: 市场代码 (如 zh-CN, en-US)
            safeSearch: 安全搜索 (Off, Moderate, Strict)
            responseFilter: 响应过滤 (Webpages, News, Images, Videos, RelatedSearches)
        
        Returns:
            {
                "_type": "SearchResponse",
                "queryContext": {...},
                "webPages": {...},
                "images": {...},
                "news": {...},
                "relatedSearches": {...},
                "rankingResponse": {...}
            }
        """
        if not self.enabled:
            return {"error": "Search disabled"}
        
        endpoint = "https://api.bing.microsoft.com/v7.0/search"
        
        params = {
            'q': query,
            'count': min(count, 50),
            'offset': offset,
            'mkt': market,
            'safesearch': safeSearch
        }
        if responseFilter:
            params['responseFilter'] = responseFilter
        
        url = f"{endpoint}?{urllib.parse.urlencode(params)}"
        
        headers = {
            'Ocp-Apim-Subscription-Key': self.api_keys['bing']
        }
        
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as response:
                return json.loads(response.read().decode('utf-8'))
        except Exception as e:
            return {"error": str(e)}
    
    # ==================== Google Custom Search API ====================
    
    def google_search(self, query: str, num: int = 10, start: int = 1,
                     gl: str = "cn", hl: str = "zh-CN",
                     cr: str = "CN", filetype: str = "") -> Dict[str, Any]:
        """
        Google Custom Search API 格式
        
        Args:
            query: 搜索关键词
            num: 每页结果数 (1-10)
            start: 起始索引 (1-100)
            gl: 地理位置
            hl: 界面语言
            cr: 国家/区域限制 (e.g., countryCN)
            filetype: 文件类型过滤 (e.g., pdf, doc)
        
        Returns:
            {
                "kind": "customsearch#search",
                "items": [...],
                "searchInformation": {...},
                "queries": {...},
                "spelling": {...}
            }
        """
        if not self.enabled:
            return {"error": "Search disabled"}
        
        cx = os.environ.get('GOOGLE_CX', '')  # Custom Search Engine ID
        endpoint = "https://www.googleapis.com/customsearch/v1"
        
        params = {
            'q': query,
            'key': self.api_keys['google'],
            'cx': cx,
            'num': min(num, 10),
            'start': start,
            'gl': gl,
            'hl': hl
        }
        if cr:
            params['cr'] = cr
        if filetype:
            params['filetype'] = filetype
        
        url = f"{endpoint}?{urllib.parse.urlencode(params)}"
        
        try:
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, timeout=15) as response:
                return json.loads(response.read().decode('utf-8'))
        except Exception as e:
            return {"error": str(e)}
    
    # ==================== 统一搜索接口 ====================
    
    def search(self, query: str, max_results: int = 10, 
               provider: str = None) -> List[Dict[str, str]]:
        """
        统一搜索接口，根据提供商调用对应API
        
        Args:
            query: 搜索关键词
            max_results: 最大结果数
            provider: 可选，指定提供商 (bing/google/duckduckgo)
        
        Returns:
            [{title, url, snippet, provider}, ...]
        """
        if not self.enabled:
            return []
        
        provider = provider or self.provider
        
        results = []
        
        if provider == "bing" and self.api_keys['bing']:
            data = self.bing_search(query, count=max_results)
            if 'webPages' in data:
                for item in data['webPages'].get('value', [])[:max_results]:
                    results.append({
                        'title': item.get('name', ''),
                        'url': item.get('url', ''),
                        'snippet': item.get('snippet', ''),
                        'provider': 'bing'
                    })
        
        elif provider == "google" and self.api_keys['google']:
            data = self.google_search(query, num=min(max_results, 10))
            if 'items' in data:
                for item in data.get('items', [])[:max_results]:
                    results.append({
                        'title': item.get('title', ''),
                        'url': item.get('link', ''),
                        'snippet': item.get('snippet', ''),
                        'provider': 'google'
                    })
        
        else:
            # Fallback to DuckDuckGo Lite
            results = self._duckduckgo_fallback(query, max_results)
        
        return results
    
    def _duckduckgo_fallback(self, query: str, max_results: int) -> List[Dict[str, str]]:
        """DuckDuckGo Lite 降级方案"""
        try:
            encoded_query = urllib.parse.quote(query)
            url = f"https://lite.duckduckgo.com/lite/?q={encoded_query}&kl=wt-wt"
            
            headers = {'User-Agent': 'Mozilla/5.0'}
            req = urllib.request.Request(url, headers=headers)
            
            with urllib.request.urlopen(req, timeout=10) as response:
                html = response.read().decode('utf-8')
            
            import re
            pattern = r'<a class="result__a" href="([^"]+)">([^<]+)</a>'
            matches = re.findall(pattern, html)
            
            results = []
            for url, title in matches[:max_results]:
                results.append({
                    'title': title,
                    'url': url,
                    'snippet': '',
                    'provider': 'duckduckgo'
                })
            return results
        except:
            return []


# 全局实例
_search_api = None

def get_search_api() -> SearchAPI:
    global _search_api
    if _search_api is None:
        _search_api = SearchAPI()
    return _search_api
