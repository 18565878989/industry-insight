import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

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
  }, [filter]);

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
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            📰 产业资讯
          </h1>
          <p className="text-purple-100 text-sm mt-1">
            实时抓取半导体行业最新动态
          </p>
        </div>
        
        {/* Controls */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="搜索资讯..."
              className="px-4 py-2 border border-slate-300 rounded-lg w-64 focus:ring-2 focus:ring-purple-500"
            />
            {lastFetch && (
              <span className="text-sm text-slate-500">
                最后更新: {formatDate(lastFetch)}
              </span>
            )}
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {refreshing ? (
              <>
                <span className="animate-spin">⏳</span>
                刷新中...
              </>
            ) : (
              <>
                🔄 立即刷新
              </>
            )}
          </button>
        </div>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-slate-500">加载中...</p>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-slate-500">暂无资讯</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            点击刷新
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNews.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-purple-200 transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-medium text-slate-800 group-hover:text-purple-600 line-clamp-2 flex-1">
                  {item.title}
                </h3>
                <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded whitespace-nowrap">
                  {item.source}
                </span>
              </div>
              
              {item.snippet && (
                <p className="text-sm text-slate-500 line-clamp-3 mb-3">
                  {item.snippet}
                </p>
              )}
              
              {item.keywords && item.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.keywords.slice(0, 3).map((kw, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="mt-3 text-xs text-slate-400">
                {item.published_at && formatDate(item.published_at)}
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 text-center text-sm text-slate-500">
        共 {filteredNews.length} 条资讯
      </div>
    </div>
  );
}
