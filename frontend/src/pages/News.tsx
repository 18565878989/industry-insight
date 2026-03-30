import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Search, RefreshCw, Clock, ExternalLink, Sparkles, Newspaper, X } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero Header - Apple Premium Style */}
      <div className="bg-gradient-to-br from-pink-600 via-rose-600 to-red-700 rounded-[2rem] overflow-hidden relative shadow-2xl shadow-pink-500/20">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
        </div>
        
        {/* Glowing orb */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-pink-400/40 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative p-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20">
              <Newspaper className="w-8 h-8" />
            </div>
            <div>
              <span className="text-sm font-semibold text-pink-200">Real-time Updates</span>
              <h1 className="text-4xl font-bold text-white tracking-tight mt-1">产业资讯</h1>
            </div>
          </div>
          <p className="text-pink-100/80 text-lg max-w-2xl">
            实时抓取半导体行业最新动态，追踪产业链最新资讯
          </p>
          
          {/* Stats */}
          <div className="flex items-center gap-6 mt-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/20">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white font-semibold">{filteredNews.length}</span>
              <span className="text-pink-200 text-sm">条资讯</span>
            </div>
            {lastFetch && (
              <div className="flex items-center gap-2 text-pink-200 text-sm">
                <Clock size={14} />
                <span>最后更新: {formatDate(lastFetch)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls - Apple Glass Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-black/5 overflow-hidden">
        <div className="p-5 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Search Input - Apple Premium Style */}
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="搜索资讯..."
                className="w-full pl-11 pr-4 py-3.5 bg-gray-100/80 border-2 border-transparent rounded-2xl text-sm focus:outline-none focus:bg-white focus:border-violet-300 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200"
              />
            </div>
            
            {lastFetch && (
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-100/80 px-4 py-2.5 rounded-xl">
                <Clock size={14} />
                <span>{formatDate(lastFetch)}</span>
              </div>
            )}
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="group flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-2xl hover:from-pink-700 hover:to-rose-700 disabled:opacity-60 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/40 transition-all duration-200"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
            立即刷新
          </button>
        </div>
      </div>

      {/* News Grid - Apple Card Style */}
      {initialLoad || (loading && news.length === 0) ? (
        <div className="flex flex-col items-center justify-center h-80 gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-pink-600 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-gray-600 font-semibold text-lg">加载中...</p>
            <p className="text-gray-400 text-sm mt-1">正在获取最新资讯</p>
          </div>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-black/5 p-16 text-center shadow-lg">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Newspaper size={40} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">暂无资讯</h3>
          <p className="text-gray-500 mb-6">点击刷新按钮获取最新资讯</p>
          <button
            onClick={handleRefresh}
            className="px-8 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            点击刷新
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-stagger">
          {filteredNews.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-lg shadow-black/5 border border-black/5 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="font-bold text-gray-900 group-hover:text-pink-600 line-clamp-2 flex-1 leading-snug text-lg">
                  {item.title}
                </h3>
                <ExternalLink size={18} className="text-gray-300 group-hover:text-pink-500 flex-shrink-0 transition-colors" />
              </div>
              
              {item.snippet && (
                <p className="text-sm text-gray-500 line-clamp-3 mb-4 leading-relaxed">
                  {item.snippet}
                </p>
              )}
              
              {item.keywords && item.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.keywords.slice(0, 3).map((kw, i) => (
                    <span 
                      key={i} 
                      className="text-xs px-3 py-1.5 bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 rounded-xl font-semibold border border-pink-100"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl font-semibold">
                  {item.source}
                </span>
                <span className="text-xs text-gray-400">
                  {item.published_at && formatDate(item.published_at)}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {filteredNews.length > 0 && (
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/95 backdrop-blur-xl rounded-full shadow-lg border border-black/5">
            <span className="text-sm text-gray-500">共</span>
            <span className="text-lg font-bold text-pink-600">{filteredNews.length}</span>
            <span className="text-sm text-gray-500">条资讯</span>
            {filter && (
              <>
                <div className="w-px h-4 bg-gray-300" />
                <button 
                  onClick={() => setFilter('')}
                  className="flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700 font-semibold"
                >
                  <X size={14} />
                  清除筛选
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
