import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Search, RefreshCw, Clock, ExternalLink, Newspaper, X } from 'lucide-react';

interface NewsItem {
  title: string;
  url: string;
  source: string;
  snippet?: string;
  published_at?: string;
  keywords?: string[];
}

export function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchNews = async (force = false) => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/api/news?limit=50${force ? '&refresh=true' : ''}${filter ? `&keyword=${filter}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setNews(data.news || []);
        setLastFetch(data.last_fetch);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    }
    setLoading(false);
    setInitialLoad(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/news/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: ['半导体', '芯片', '长江存储', '台积电', '光刻机', '集成电路']
        })
      });
      const data = await response.json();
      if (data.success) {
        setNews(data.news || []);
        setLastFetch(data.fetched_at);
      }
    } catch (error) {
      console.error('Failed to refresh news:', error);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '未知';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN');
  };

  const filteredNews = filter 
    ? news.filter(n => 
        n.title.toLowerCase().includes(filter.toLowerCase()) ||
        (n.snippet && n.snippet.toLowerCase().includes(filter.toLowerCase())))
    : news;

  return (
    <div className="space-y-px">
      {/* Hero Header */}
      <div className="bg-[var(--bg-primary)] px-8 py-16 border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full" />
            <span className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-medium">Real-time Updates</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] tracking-tight leading-[1.1]">
            Industry<br />News
          </h1>
          <p className="text-[var(--text-secondary)] mt-6 max-w-xl text-base">
            实时抓取半导体行业最新动态，追踪产业链最新资讯
          </p>
          
          {/* Stats row */}
          <div className="flex items-center gap-6 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[var(--accent)] rounded-full" />
              <span className="font-semibold text-[var(--text-primary)]">{filteredNews.length}</span>
              <span className="text-[var(--text-secondary)]">条资讯</span>
            </div>
            {lastFetch && (
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Clock size={14} />
                <span>{formatDate(lastFetch)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[var(--bg-secondary)] px-8 py-5 border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="搜索资讯..."
              className="w-full pl-10 pr-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--border-color-hover)] transition-colors placeholder:text-[var(--text-secondary)]"
            />
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-5 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            刷新
          </button>
        </div>
      </div>

      {/* News Grid */}
      {initialLoad || (loading && news.length === 0) ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4 bg-[var(--bg-primary)]">
          <div className="w-8 h-8 border border-[var(--border-color)] border-t-[var(--text-primary)] rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)] text-sm font-medium">加载中...</p>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="bg-[var(--bg-primary)] px-8 py-20 text-center">
          <Newspaper size={40} className="text-[var(--text-faint)] mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">暂无资讯</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-6">点击刷新按钮获取最新资讯</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            点击刷新
          </button>
        </div>
      ) : (
        <div className="bg-[var(--bg-primary)] px-8 py-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredNews.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 hover:border-[var(--border-color-hover)] transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--text-secondary)] line-clamp-2 flex-1 text-sm leading-snug">
                    {item.title}
                  </h3>
                  <ExternalLink size={14} className="text-[var(--text-faint)] flex-shrink-0" />
                </div>
                
                {item.snippet && (
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4 leading-relaxed">
                    {item.snippet}
                  </p>
                )}
                
                {item.keywords && item.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.keywords.slice(0, 3).map((kw, i) => (
                      <span 
                        key={i} 
                        className="text-xs px-2 py-1 bg-[var(--bg-hover)] text-[var(--text-secondary)] font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                  <span className="text-xs px-2 py-1 bg-[var(--bg-hover)] text-[var(--text-secondary)] font-medium">
                    {item.source}
                  </span>
                  <span className="text-xs text-[var(--text-faint)]">
                    {item.published_at && formatDate(item.published_at)}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Stats Footer */}
      {filteredNews.length > 0 && (
        <div className="bg-[var(--bg-primary)] px-8 py-6 border-t border-[var(--border-color)]">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-4">
              <span className="text-sm text-[var(--text-secondary)]">共</span>
              <span className="text-xl font-bold text-[var(--text-primary)]">{filteredNews.length}</span>
              <span className="text-sm text-[var(--text-secondary)]">条资讯</span>
              {filter && (
                <>
                  <div className="w-px h-4 bg-[var(--border-color)]" />
                  <button 
                    onClick={() => setFilter('')}
                    className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors"
                  >
                    <X size={14} />
                    清除筛选
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
