import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Search, RefreshCw, Clock, ExternalLink, Sparkles, Newspaper, X, Zap, TrendingUp } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Header - Apple Premium Style v3 */}
      <div className="apple-hero-mesh rounded-[2rem] overflow-hidden relative shadow-2xl shadow-pink-500/25">
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-12 left-12 w-3 h-3 bg-white/20 rounded-full animate-float" />
          <div className="absolute top-24 right-24 w-2 h-2 bg-white/15 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/3 w-4 h-4 bg-pink-300/20 rounded-full animate-breathe-glow" />
        </div>
        
        <div className="relative p-12">
          <div className="flex items-start justify-between gap-8">
            <div className="flex items-center gap-5 mb-6">
              <div className="p-5 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg">
                <Newspaper className="w-10 h-10" />
              </div>
              <div>
                <span className="text-sm font-semibold text-pink-200 tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Real-time Updates
                </span>
                <h1 className="text-5xl font-bold text-white tracking-tight mt-1">产业资讯</h1>
              </div>
            </div>
            
            {/* Live indicator */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/15 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/20">
                <TrendingUp className="w-5 h-5 text-pink-200" />
                <span className="text-white font-bold">{filteredNews.length}</span>
                <span className="text-pink-200 text-sm">条资讯</span>
              </div>
            </div>
          </div>
          
          <p className="text-pink-100/80 text-lg max-w-2xl leading-relaxed">
            实时抓取半导体行业最新动态，追踪产业链最新资讯
          </p>
          
          {/* Stats row */}
          <div className="flex items-center gap-6 mt-10">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/20">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white font-semibold">{filteredNews.length}</span>
              <span className="text-pink-200 text-sm">条资讯</span>
            </div>
            {lastFetch && (
              <div className="hidden sm:flex items-center gap-2 text-pink-200 text-sm">
                <Clock size={14} />
                <span>最后更新: {formatDate(lastFetch)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls - Apple Glass Card v3 */}
      <div className="apple-card-glass overflow-hidden animate-scale-in" style={{ animationDelay: '200ms' }}>
        <div className="p-6 flex flex-wrap gap-5 items-center justify-between">
          <div className="flex items-center gap-5 flex-1">
            {/* Search Input - Apple Premium Style */}
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="搜索资讯..."
                className="w-full pl-12 pr-5 py-4 bg-gray-100/80 border-2 border-transparent rounded-2xl text-sm focus:outline-none focus:bg-white focus:border-violet-300 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200"
              />
            </div>
            
            {lastFetch && (
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-100/80 px-4 py-3 rounded-xl">
                <Clock size={14} />
                <span>{formatDate(lastFetch)}</span>
              </div>
            )}
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-2xl hover:from-pink-700 hover:to-rose-700 disabled:opacity-60 shadow-xl shadow-pink-500/30 hover:shadow-pink-500/40 transition-all duration-200"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-apple-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
            立即刷新
          </button>
        </div>
      </div>

      {/* News Grid - Apple Card Style v3 */}
      {initialLoad || (loading && news.length === 0) ? (
        <div className="flex flex-col items-center justify-center h-80 gap-8">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-pink-200 border-t-pink-600 rounded-full animate-apple-spin" />
            <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-pink-600 animate-pulse" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-gray-600 font-semibold text-xl tracking-wide">加载中...</p>
            <p className="text-gray-400 text-sm">正在获取最新资讯</p>
          </div>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="apple-empty-state animate-scale-in">
          <div className="apple-empty-state-icon">
            <Newspaper size={40} className="text-gray-300" />
          </div>
          <h3 className="apple-empty-state-title">暂无资讯</h3>
          <p className="apple-empty-state-description">点击刷新按钮获取最新资讯</p>
          <button
            onClick={handleRefresh}
            className="mt-8 px-10 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200"
          >
            点击刷新
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group apple-card-interactive p-6"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <h3 className="font-bold text-gray-900 group-hover:text-pink-600 line-clamp-2 flex-1 leading-snug text-lg tracking-tight">
                  {item.title}
                </h3>
                <ExternalLink size={18} className="text-gray-300 group-hover:text-pink-500 flex-shrink-0 transition-colors" />
              </div>
              
              {item.snippet && (
                <p className="text-sm text-gray-500 line-clamp-3 mb-5 leading-relaxed">
                  {item.snippet}
                </p>
              )}
              
              {item.keywords && item.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {item.keywords.slice(0, 3).map((kw, i) => (
                    <span 
                      key={i} 
                      className="text-xs px-4 py-2 bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 rounded-xl font-bold border border-pink-100"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                <span className="text-xs px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold">
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

      {/* Stats Footer - Apple Pills */}
      {filteredNews.length > 0 && (
        <div className="text-center animate-scale-in" style={{ animationDelay: '300ms' }}>
          <div className="inline-flex items-center gap-4 px-8 py-4 apple-card-glass shadow-lg">
            <span className="text-sm text-gray-500">共</span>
            <span className="text-2xl font-bold gradient-text-fusion">{filteredNews.length}</span>
            <span className="text-sm text-gray-500">条资讯</span>
            {filter && (
              <>
                <div className="w-px h-5 bg-gray-300" />
                <button 
                  onClick={() => setFilter('')}
                  className="flex items-center gap-2 text-sm text-pink-600 hover:text-pink-700 font-bold transition-colors"
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
