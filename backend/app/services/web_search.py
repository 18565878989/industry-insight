"""
Web Search Service - 产业洞察网络搜索
支持开关控制是否抓取全网最新信息
"""
import os
import json
import urllib.request
import urllib.parse
from typing import Dict, List, Any, Optional

class WebSearchService:
    """网络搜索服务"""
    
    def __init__(self):
        self.enabled = True  # 默认启用网络搜索
        
    def enable(self):
        """启用网络搜索"""
        self.enabled = True
        
    def disable(self):
        """禁用网络搜索"""
        self.enabled = False
        
    def is_enabled(self) -> bool:
        """检查是否启用"""
        return self.enabled
    
    def search(self, query: str, max_results: int = 10) -> List[Dict[str, str]]:
        """
        执行网络搜索
        
        Args:
            query: 搜索关键词
            max_results: 最大结果数
            
        Returns:
            [{title, url, snippet}, ...]
        """
        if not self.enabled:
            return []
        
        try:
            # 使用 DuckDuckGo Lite API (无需 API Key)
            encoded_query = urllib.parse.quote(query)
            url = f"https://lite.duckduckgo.com/lite/?q={encoded_query}&kl=wt-wt"
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
            
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as response:
                html = response.read().decode('utf-8')
            
            # 解析结果
            results = self._parse_ddg_results(html, max_results)
            return results
            
        except Exception as e:
            print(f"Search error: {e}")
            return []
    
    def _parse_ddg_results(self, html: str, max_results: int) -> List[Dict[str, str]]:
        """解析 DuckDuckGo 搜索结果"""
        results = []
        
        # 简单解析 - 查找结果链接和标题
        import re
        
        # 匹配结果模式
        pattern = r'<a class="result__a" href="([^"]+)">([^<]+)</a>'
        matches = re.findall(pattern, html)
        
        for url, title in matches[:max_results]:
            # 获取对应的 snippet
            snippet = self._get_snippet_for_result(html, url)
            results.append({
                'title': self._clean_html(title),
                'url': url,
                'snippet': snippet
            })
        
        return results
    
    def _get_snippet_for_result(self, html: str, url: str) -> str:
        """获取结果摘要"""
        import re
        
        # 查找 URL 附近的 snippet
        pattern = rf'{re.escape(url)}</a></h2><p class="result__snippet">([^<]+)</p>'
        match = re.search(pattern, html)
        
        if match:
            return self._clean_html(match.group(1))
        
        # 备选方案
        pattern = rf'result__snippet">([^<]+)</p>'
        match = re.search(pattern, html)
        if match:
            return self._clean_html(match.group(1))
        
        return ""
    
    def _clean_html(self, text: str) -> str:
        """清理 HTML 实体"""
        import re
        text = re.sub(r'<[^>]+>', '', text)
        text = text.replace('&amp;', '&')
        text = text.replace('&lt;', '<')
        text = text.replace('&gt;', '>')
        text = text.replace('&quot;', '"')
        text = text.replace('&#39;', "'")
        return text.strip()


# 全局实例
_search_service = None

def get_search_service() -> WebSearchService:
    """获取搜索服务实例"""
    global _search_service
    if _search_service is None:
        _search_service = WebSearchService()
    return _search_service
