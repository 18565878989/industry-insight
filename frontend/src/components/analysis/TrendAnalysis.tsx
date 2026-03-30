import { useEffect, useState } from 'react';
import { analysisApi } from '../../services/api';
import type { TrendData, MarketShare } from '../../types';
import { TrendingUp, PieChart, BarChart3, Activity, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TrendAnalysis() {
  const [trends, setTrends] = useState<TrendData | null>(null);
  const [marketShare, setMarketShare] = useState<MarketShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [trendsData, marketShareData] = await Promise.all([
          analysisApi.getTrends(),
          analysisApi.getMarketShare(),
        ]);
        setTrends(trendsData);
        setMarketShare(marketShareData);
      } catch (err) {
        setError('Failed to load analysis data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toFixed(0)}`;
  };

  const getStageColor = (index: number) => {
    const colors = [
      'from-purple-500 via-violet-600 to-indigo-600',
      'from-violet-500 via-fuchsia-600 to-purple-600',
      'from-blue-500 via-cyan-600 to-teal-600',
      'from-cyan-500 via-teal-600 to-emerald-600',
      'from-teal-500 via-emerald-600 to-green-600',
      'from-amber-500 via-orange-600 to-yellow-600',
      'from-red-500 via-rose-600 to-pink-600',
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
          <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-orange-600 animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-gray-600 font-semibold text-lg">Loading analysis...</p>
          <p className="text-gray-400 text-sm mt-1">Processing market data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="apple-alert apple-alert-error max-w-2xl mx-auto">
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Error</h3>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  const totalRelationships = trends?.relationship_distribution.reduce((acc, r) => acc + r.count, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-700 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-orange-500/20">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPBlVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
        </div>
        
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-400/40 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <span className="text-sm font-semibold text-orange-200">Market Intelligence</span>
              <h2 className="text-4xl font-bold tracking-tight mt-1">趋势分析</h2>
            </div>
          </div>
          <p className="text-orange-100/80 text-lg max-w-2xl">
            洞察半导体市场动态与趋势，分析行业格局变化
          </p>
        </div>
      </div>

      {/* Revenue by Sector - Apple Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-xl shadow-black/5 border border-black/5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BarChart3 size={28} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl">Revenue by Sector</h3>
              <p className="text-sm text-gray-500">Total revenue across semiconductor sectors</p>
            </div>
          </div>
          <Link 
            to="/companies" 
            className="group flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-all duration-200"
          >
            View all
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="space-y-5">
          {trends?.revenue_by_sector.map((sector, index) => {
            const maxRevenue = Math.max(...(trends?.revenue_by_sector.map(s => s.total_revenue) || [1]));
            const percentage = (sector.total_revenue / maxRevenue) * 100;
            return (
              <div key={sector.sector} className="group/item">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-bold text-gray-700">{sector.sector || 'Unknown'}</span>
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(sector.total_revenue)}</span>
                </div>
                <div className="h-3.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getStageColor(index)} rounded-full transition-all duration-1000 ease-out group-hover/item:shadow-lg`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Share - Apple Cards Grid */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-xl shadow-black/5 border border-black/5">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <PieChart size={28} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-xl">Market Share by Supply Chain Stage</h3>
            <p className="text-sm text-gray-500">Revenue distribution across supply chain</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {marketShare.map((share, index) => (
            <div
              key={share.stage}
              className={`
                bg-gradient-to-br ${getStageColor(index)} rounded-2xl p-6 text-white 
                shadow-xl hover:scale-105 hover:shadow-2xl 
                transition-all duration-300 cursor-pointer
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-lg">{share.stage || 'Unknown'}</span>
                <span className="text-xs px-3 py-1.5 bg-white/20 backdrop-blur-xl rounded-xl font-bold">{share.company_count} companies</span>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(share.total_revenue)}</p>
              <div className="mt-3 flex items-center gap-2">
                <Activity size={14} className="text-white/70" />
                <p className="text-sm text-white/70">
                  Market Cap: {formatCurrency(share.total_market_cap)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Relationship Distribution */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-xl shadow-black/5 border border-black/5">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-violet-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Activity size={28} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-xl">Relationship Distribution</h3>
            <p className="text-sm text-gray-500">Types of connections between companies</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trends?.relationship_distribution.map((rel, index) => {
            const percentage = totalRelationships > 0 ? (rel.count / totalRelationships) * 100 : 0;
            return (
              <div 
                key={rel.type} 
                className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-5 text-center border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                <div className="text-3xl font-bold text-gray-900">{rel.count}</div>
                <p className="text-xs text-gray-500 mt-2 font-bold">{rel.type}</p>
                <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getStageColor(index)} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">{percentage.toFixed(1)}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Insights - Apple Hero Card */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
              <TrendingUp size={28} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold">Key Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
              <p className="text-sm text-gray-400 font-bold uppercase tracking-wide">Top Sector by Revenue</p>
              <p className="text-xl font-bold mt-3">
                {trends?.revenue_by_sector[0]?.sector || 'N/A'}
              </p>
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 mt-3">
                {formatCurrency(trends?.revenue_by_sector[0]?.total_revenue || 0)}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
              <p className="text-sm text-gray-400 font-bold uppercase tracking-wide">Most Common Relationship</p>
              <p className="text-xl font-bold mt-3">
                {trends?.relationship_distribution[0]?.type || 'N/A'}
              </p>
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mt-3">
                {trends?.relationship_distribution[0]?.count || 0} connections
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights CTA */}
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
        </div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20">
              <Zap size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Need Deeper Insights?</h3>
              <p className="text-indigo-100/80 mt-1 max-w-lg">
                Ask our AI assistant to analyze trends, compare companies, or explore supply chain relationships.
              </p>
            </div>
          </div>
          <Link
            to="/assistant"
            className="flex items-center gap-3 px-8 py-4 bg-white text-violet-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <Sparkles size={20} />
            Ask AI
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
