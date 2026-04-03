"""
News Service - 产业资讯 RSS 抓取服务
集成全球主流半导体 RSS 订阅源
"""
import os
import json
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from typing import List, Dict, Any

# 半导体行业 RSS 订阅源列表
SEMI_RSS_FEEDS = [
    # 深度技术与产业洞察 - 最可靠快速的源
    {"name": "Semiconductor Engineering", "url": "https://semiengineering.com/feed/", "category": "Technology"},
    {"name": "SemiWiki", "url": "https://semiwiki.com/feed/", "category": "Technology"},
    {"name": "Tech Xplore", "url": "https://techxplore.com/rss-feed/semiconductors-news/", "category": "Advanced"},
    {"name": "Semiconductor Today", "url": "https://www.semiconductor-today.com/rss/news.xml", "category": "Technology"},
    {"name": "EE Times", "url": "https://www.eetimes.com/feed/", "category": "Market"},
]

# RSSHub 源 (国内源)
RSSHUB_FEEDS = [
    {"name": "集微网", "url": "https://rsshub.app/jiweilun/home", "category": "China"},
]


class NewsService:
    """产业资讯 RSS 服务"""
    
    def __init__(self):
        self.enabled = True
        self.last_fetch = None
        self.news_data = []
        self.fetch_interval_hours = 2  # 默认2小时抓取一次
        self.timeout = 10  # 请求超时时间
    
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
    
    def fetch_industry_news(self, keywords: List[str] = None, max_results: int = 50) -> List[Dict[str, Any]]:
        """
        通过 RSS 抓取产业资讯
        
        Args:
            keywords: 关键词列表 (用于过滤)
            max_results: 最大结果数
        
        Returns:
            [{title, url, source, published_at, snippet, keywords, category}, ...]
        """
        all_news = []
        failed_sources = []
        
        # 抓取所有 RSS 源
        for feed in SEMI_RSS_FEEDS:
            try:
                news = self._fetch_rss(feed)
                if news:
                    all_news.extend(news)
                else:
                    failed_sources.append(feed['name'])
            except Exception as e:
                print(f"Error fetching {feed['name']}: {e}")
                failed_sources.append(feed['name'])
        
        # 如果所有源都失败，尝试 RSSHub 备选源
        if len(failed_sources) == len(SEMI_RSS_FEEDS):
            print("All primary RSS feeds failed, trying RSSHub sources...")
            for feed in RSSHUB_FEEDS:
                try:
                    news = self._fetch_rss(feed)
                    if news:
                        all_news.extend(news)
                except Exception as e:
                    print(f"RSSHub Error ({feed['name']}): {e}")
        
        # 按关键词过滤
        if keywords:
            filtered_news = []
            for news in all_news:
                title_lower = news['title'].lower()
                snippet_lower = news.get('snippet', '').lower()
                for kw in keywords:
                    if kw.lower() in title_lower or kw.lower() in snippet_lower:
                        filtered_news.append(news)
                        break
            all_news = filtered_news
        
        # 按发布时间排序 (最新的在前)
        all_news.sort(key=lambda x: x.get('published_at', ''), reverse=True)
        
        # 去重
        seen = set()
        unique_news = []
        for item in all_news:
            if item['url'] not in seen:
                seen.add(item['url'])
                unique_news.append(item)
        
        # 限制数量
        self.news_data = unique_news[:max_results]
        self.last_fetch = datetime.now()
        
        print(f"Fetched {len(self.news_data)} news from {len(SEMI_RSS_FEEDS) - len(failed_sources)}/{len(SEMI_RSS_FEEDS)} RSS sources")
        
        return self.news_data
    
    def _fetch_rss(self, feed: Dict[str, str]) -> List[Dict[str, Any]]:
        """抓取单个 RSS 源"""
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        }
        
        req = urllib.request.Request(feed['url'], headers=headers)
        
        with urllib.request.urlopen(req, timeout=self.timeout) as response:
            raw_content = response.read()
            # 尝试多种编码
            xml_content = None
            for encoding in ['utf-8', 'utf-8-sig', 'big5', 'gb2312', 'gbk', 'latin-1']:
                try:
                    xml_content = raw_content.decode(encoding)
                    break
                except:
                    continue
            if xml_content is None:
                xml_content = raw_content.decode('utf-8', errors='replace')
        
        return self._parse_rss(xml_content, feed)
    
    def _parse_rss(self, xml_content: str, feed: Dict[str, str]) -> List[Dict[str, Any]]:
        """解析 RSS XML"""
        results = []
        
        try:
            root = ET.fromstring(xml_content)
        except Exception as e:
            print(f"XML parse error for {feed['name']}: {e}")
            return results
        
        # 尝试 RSS 2.0 格式
        items = root.findall('.//item')
        
        # 尝试 Atom 格式
        if not items:
            items = root.findall('.//entry')
        
        for item in items[:20]:  # 每个源最多取20条
            try:
                # 提取标题
                title = self._get_text(item, 'title')
                if not title:
                    continue
                
                # 提取链接
                url = self._get_text(item, 'link')
                if not url:
                    # Atom 格式的链接可能在 href 属性中
                    link_elem = item.find('link')
                    if link_elem is not None and link_elem.get('href'):
                        url = link_elem.get('href')
                
                if not url:
                    continue
                
                # 提取描述/摘要
                description = self._get_text(item, 'description') or \
                             self._get_text(item, 'summary') or \
                             self._get_text(item, 'content') or ""
                
                # 清理 HTML
                snippet = self._clean_html(description)
                if len(snippet) > 300:
                    snippet = snippet[:300] + '...'
                
                # 提取发布时间
                published_at = self._get_text(item, 'pubDate') or \
                              self._get_text(item, 'published') or \
                              self._get_text(item, 'updated') or \
                              datetime.now().isoformat()
                
                # 解析日期
                try:
                    from email.utils import parsedate_to_datetime
                    published_at = parsedate_to_datetime(published_at).isoformat()
                except:
                    published_at = datetime.now().isoformat()
                
                results.append({
                    'title': self._clean_html(title),
                    'url': url.strip(),
                    'source': feed['name'],
                    'published_at': published_at,
                    'snippet': snippet,
                    'keywords': [feed['category']],
                    'category': feed['category']
                })
                
            except Exception as e:
                print(f"Error parsing item in {feed['name']}: {e}")
                continue
        
        return results
    
    def _get_text(self, element, tag: str) -> str:
        """安全获取元素文本"""
        try:
            elem = element.find(tag)
            if elem is not None and elem.text:
                return elem.text.strip()
        except:
            pass
        return ""
    
    def _clean_html(self, text: str) -> str:
        """清理 HTML 标签"""
        import re
        if not text:
            return ""
        # 移除 HTML 标签
        text = re.sub(r'<[^>]+>', '', text)
        # 解码 HTML 实体
        text = text.replace('&amp;', '&')
        text = text.replace('&lt;', '<')
        text = text.replace('&gt;', '>')
        text = text.replace('&quot;', '"')
        text = text.replace('&#39;', "'")
        text = text.replace('&nbsp;', ' ')
        # 清理多余空白
        text = re.sub(r'\s+', ' ', text)
        return text.strip()
    
    def get_news(self, filter_keyword: str = None, limit: int = 50) -> List[Dict[str, Any]]:
        """获取资讯列表"""
        news = self.news_data
        
        if filter_keyword:
            news = [n for n in news if 
                    filter_keyword.lower() in n['title'].lower() or 
                    filter_keyword.lower() in n.get('snippet', '').lower()]
        
        return news[:limit]
    
    def get_news_by_keyword(self, keyword: str) -> List[Dict[str, Any]]:
        """按关键词搜索资讯"""
        return [n for n in self.news_data if keyword.lower() in n['title'].lower()]
    
    def get_sources(self) -> List[Dict[str, str]]:
        """获取已配置的 RSS 源列表"""
        return [{"name": f['name'], "category": f['category'], "url": f['url']} for f in SEMI_RSS_FEEDS]


# 全局实例
_news_service = None

def get_news_service() -> NewsService:
    global _news_service
    if _news_service is None:
        _news_service = NewsService()
    return _news_service
