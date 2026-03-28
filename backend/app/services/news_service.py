"""
News Service - 产业资讯定时抓取服务
"""
import os
import json
import urllib.request
import urllib.parse
from datetime import datetime, timedelta
from typing import List, Dict, Any

class NewsService:
    """产业资讯服务"""
    
    def __init__(self):
        self.enabled = True
        self.last_fetch = None
        self.news_data = []
        self.fetch_interval_hours = 6  # 默认6小时抓取一次
    
    def enable(self):
        self.enabled = True
    
    def disable(self):
        self.enabled = False
    
    def is_enabled(self) -> bool:
        return self.enabled
    
    def set_interval(self, hours: int):
        self.fetch_interval_hours = hours
    
    def should_fetch(self) -> bool:
        """检查是否需要抓取"""
        if not self.enabled:
            return False
        if self.last_fetch is None:
            return True
        elapsed = datetime.now() - self.last_fetch
        return elapsed > timedelta(hours=self.fetch_interval_hours)
    
    def fetch_industry_news(self, keywords: List[str] = None, max_results: int = 20) -> List[Dict[str, Any]]:
        """
        抓取产业资讯
        
        Args:
            keywords: 关键词列表
            max_results: 最大结果数
        
        Returns:
            [{title, url, source, published_at, snippet, keywords}, ...]
        """
        if keywords is None:
            keywords = [
                '半导体', '芯片', '集成电路', 
                '长江存储', '台积电', '三星', '英特尔',
                '光刻机', 'EUV', '晶圆'
            ]
        
        all_news = []
        
        for keyword in keywords[:5]:  # 限制关键词数量
            news = self._fetch_by_keyword(keyword, max_results // len(keywords))
            all_news.extend(news)
        
        # 去重
        seen = set()
        unique_news = []
        for item in all_news:
            if item['url'] not in seen:
                seen.add(item['url'])
                unique_news.append(item)
        
        self.news_data = unique_news
        self.last_fetch = datetime.now()
        
        return unique_news
    
    def _fetch_by_keyword(self, keyword: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """根据关键词抓取"""
        try:
            encoded_keyword = urllib.parse.quote(keyword)
            url = f"https://lite.duckduckgo.com/lite/?q={encoded_keyword}&kl=wt-wt"
            
            headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
            req = urllib.request.Request(url, headers=headers)
            
            with urllib.request.urlopen(req, timeout=10) as response:
                html = response.read().decode('utf-8')
            
            return self._parse_results(html, keyword)
            
        except Exception as e:
            print(f"Error fetching news for '{keyword}': {e}")
            return []
    
    def _parse_results(self, html: str, keyword: str) -> List[Dict[str, Any]]:
        """解析搜索结果"""
        import re
        
        results = []
        pattern = r'<a class="result__a" href="([^"]+)">([^<]+)</a>'
        matches = re.findall(pattern, html)
        
        for url, title in matches[:max_results]:
            # 获取 snippet
            snippet_match = re.search(rf'{re.escape(url)}</a></h2><p class="result__snippet">([^<]+)</p>', html)
            snippet = snippet_match.group(1) if snippet_match else ""
            
            # 清理 HTML
            title = self._clean_html(title)
            snippet = self._clean_html(snippet)
            
            results.append({
                'title': title,
                'url': url,
                'source': self._extract_domain(url),
                'published_at': datetime.now().isoformat(),
                'snippet': snippet,
                'keywords': [keyword]
            })
        
        return results
    
    def _clean_html(self, text: str) -> str:
        """清理 HTML"""
        import re
        text = re.sub(r'<[^>]+>', '', text)
        text = text.replace('&amp;', '&')
        text = text.replace('&lt;', '<')
        text = text.replace('&gt;', '>')
        return text.strip()
    
    def _extract_domain(self, url: str) -> str:
        """提取域名"""
        try:
            from urllib.parse import urlparse
            parsed = urlparse(url)
            return parsed.netloc
        except:
            return "unknown"
    
    def get_news(self, filter_keyword: str = None, limit: int = 50) -> List[Dict[str, Any]]:
        """获取资讯列表"""
        if filter_keyword:
            return [n for n in self.news_data if filter_keyword in n['title'] or filter_keyword in n['snippet']][:limit]
        return self.news_data[:limit]
    
    def get_news_by_keyword(self, keyword: str) -> List[Dict[str, Any]]:
        """按关键词搜索资讯"""
        return [n for n in self.news_data if keyword in n['keywords']]


# 全局实例
_news_service = None

def get_news_service() -> NewsService:
    global _news_service
    if _news_service is None:
        _news_service = NewsService()
    return _news_service
