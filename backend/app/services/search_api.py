"""
Search API Service - 支持多种搜索引擎接口
- Bing Search API (商用)
- Google Custom Search API (商用)
- DuckDuckGo Instant Answer API (零成本/无鉴权)
- DuckDuckGo Lite API (零成本/无鉴权)
- 百度千帆 AI 搜索 (商用 API / 100次/日免费)
"""
import os
import json
import urllib.request
import urllib.parse
import urllib.error
from typing import Dict, List, Any, Optional

class SearchAPI:
    """
    统一搜索API，支持 Bing/Google 格式
    """
    
    def __init__(self):
        self.enabled = True
        self.provider = "duckduckgo"  # 默认 DuckDuckGo (零成本)
        self.api_keys = {
            'bing': os.environ.get('BING_API_KEY', ''),
            'google': os.environ.get('GOOGLE_API_KEY', ''),
            'qianfan': os.environ.get('QIANFAN_API_KEY', ''),  # 百度千帆
            'qianfan_secret': os.environ.get('QIANFAN_SECRET_KEY', '')
        }
    
    def enable(self):
        self.enabled = True
    
    def disable(self):
        self.enabled = False
    
    def is_enabled(self) -> bool:
        return self.enabled
    
    def set_provider(self, provider: str):
        """设置搜索提供商: bing | google | duckduckgo | duckduckgo_instant | qianfan"""
        if provider in ['bing', 'google', 'duckduckgo', 'duckduckgo_instant', 'qianfan']:
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
    
    # ==================== DuckDuckGo Instant Answer API ====================
    
    def duckduckgo_instant_answer(self, query: str) -> Dict[str, Any]:
        """
        DuckDuckGo Instant Answer API (零成本/无鉴权)
        返回直接答案和精选摘要
        
        Args:
            query: 搜索关键词
        
        Returns:
            {
                "answerType": "php",
                "heading": "...",
                "results": [...],
                "abstractText": "...",
                "abstractURL": "...",
                "image": {...}
            }
        """
        if not self.enabled:
            return {"error": "Search disabled"}
        
        endpoint = "https://api.duckduckgo.com/"
        
        params = {
            'q': query,
            'format': 'json',
            'no_html': '1',
            'skip_disambig': '1',
            'include_topic_related': '1',
            'include_heading_strip_html': '1'
        }
        
        url = f"{endpoint}?{urllib.parse.urlencode(params)}"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as response:
                data = json.loads(response.read().decode('utf-8'))
                
                result = {
                    'success': True,
                    'answer_type': data.get('AnswerType', ''),
                    'heading': data.get('Heading', ''),
                    'abstract_text': data.get('AbstractText', ''),
                    'abstract_url': data.get('AbstractURL', ''),
                    'definition_text': data.get('DefinitionText', ''),
                    'definition_url': data.get('DefinitionURL', ''),
                    'related_topics': [],
                    'results': []
                }
                
                # 解析 Related Topics
                for topic in data.get('RelatedTopics', [])[:10]:
                    if 'Text' in topic:
                        result['related_topics'].append({
                            'text': topic.get('Text', ''),
                            'url': topic.get('FirstURL', '')
                        })
                
                # 解析 Results
                for item in data.get('Results', [])[:10]:
                    if 'Text' in item:
                        result['results'].append({
                            'text': item.get('Text', ''),
                            'url': item.get('FirstURL', '')
                        })
                
                return result
                
        except urllib.error.HTTPError as e:
            return {"error": f"HTTP Error: {e.code}"}
        except Exception as e:
            return {"error": str(e)}
    
    # ==================== 百度千帆 AI 搜索 API ====================
    
    def qianfan_search(self, query: str, max_results: int = 10) -> Dict[str, Any]:
        """
        百度千帆 AI 搜索 (商用 API / 100次/日免费)
        
        Args:
            query: 搜索关键词
            max_results: 最大结果数
        
        Returns:
            {
                "success": true,
                "query": "...",
                "results": [...],
                "total": 100,
                "source": "qianfan"
            }
        """
        if not self.enabled:
            return {"error": "Search disabled"}
        
        api_key = self.api_keys.get('qianfan', '')
        secret_key = self.api_keys.get('qianfan_secret', '')
        
        if not api_key or not secret_key:
            return {"error": "Qianfan API key not configured", "hint": "Please set QIANFAN_API_KEY and QIANFAN_SECRET_KEY"}
        
        try:
            # Step 1: Get Access Token
            auth_endpoint = "https://aip.baidubce.com/oauth/2.0/token"
            auth_params = {
                'grant_type': 'client_credentials',
                'client_id': api_key,
                'client_secret': secret_key
            }
            auth_url = f"{auth_endpoint}?{urllib.parse.urlencode(auth_params)}"
            
            auth_req = urllib.request.Request(auth_url)
            with urllib.request.urlopen(auth_req, timeout=10) as auth_response:
                auth_data = json.loads(auth_response.read().decode('utf-8'))
                access_token = auth_data.get('access_token')
            
            if not access_token:
                return {"error": "Failed to get access token"}
            
            # Step 2: Call AI Search API
            search_endpoint = "https://aip.baidubce.com/rpc/2.0/ai_search/v1/information_extraction"
            search_url = f"{search_endpoint}?access_token={access_token}"
            
            search_payload = {
                "query": query,
                "max_results": max_results
            }
            
            search_req = urllib.request.Request(
                search_url,
                data=json.dumps(search_payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )
            
            with urllib.request.urlopen(search_req, timeout=15) as search_response:
                data = json.loads(search_response.read().decode('utf-8'))
                
                results = []
                if 'results' in data:
                    for item in data['results'][:max_results]:
                        results.append({
                            'title': item.get('title', ''),
                            'url': item.get('url', ''),
                            'snippet': item.get('abstract', item.get('content', '')),
                            'source': item.get('source', ''),
                            'date': item.get('date', '')
                        })
                
                return {
                    'success': True,
                    'query': query,
                    'results': results,
                    'total': len(results),
                    'source': 'qianfan'
                }
                
        except urllib.error.HTTPError as e:
            error_body = json.loads(e.read().decode('utf-8')) if e.fp else {}
            return {"error": f"HTTP Error: {e.code}", "detail": error_body.get('error_msg', '')}
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
        
        elif provider == "duckduckgo_instant":
            # DuckDuckGo Instant Answer API
            data = self.duckduckgo_instant_answer(query)
            if 'success' in data and data['success']:
                # 优先使用抽象摘要
                if data.get('abstract_text'):
                    results.append({
                        'title': data.get('heading', query),
                        'url': data.get('abstract_url', ''),
                        'snippet': data.get('abstract_text', ''),
                        'provider': 'duckduckgo_instant'
                    })
                # 添加相关主题
                for topic in data.get('related_topics', [])[:max_results-1]:
                    results.append({
                        'title': query,
                        'url': topic.get('url', ''),
                        'snippet': topic.get('text', ''),
                        'provider': 'duckduckgo_instant'
                    })
        
        elif provider == "qianfan":
            # 百度千帆 AI 搜索
            data = self.qianfan_search(query, max_results)
            if 'success' in data and data['success']:
                for item in data.get('results', [])[:max_results]:
                    results.append({
                        'title': item.get('title', ''),
                        'url': item.get('url', ''),
                        'snippet': item.get('snippet', ''),
                        'provider': 'qianfan',
                        'source': item.get('source', ''),
                        'date': item.get('date', '')
                    })
            elif 'error' in data:
                return [{'error': data['error'], 'hint': data.get('hint', '')}]
        
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
