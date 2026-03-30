import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Package,
  Network,
  TrendingUp,
  ArrowRight,
  Activity,
  Sparkles,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { analysisApi } from '../services/api';
import type { Summary, TrendData } from '../types';

export function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [trends, setTrends] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [summaryData, trendsData] = await Promise.all([
          analysisApi.getSummary(),
          analysisApi.getTrends(),
        ]);
        setSummary(summaryData);
        setTrends(trendsData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-violet-600 animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-gray-600 font-semibold text-lg">Loading insights...</p>
          <p className="text-gray-400 text-sm mt-1">Fetching latest semiconductor data</p>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="apple-alert apple-alert-error max-w-2xl mx-auto mt-8">
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Error Loading Data</h3>
          <p className="text-sm opacity-80">{error || 'Failed to load dashboard data'}</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toFixed(0)}`;
  };

  const statCards = [
    {
      label: 'Total Companies',
      value: summary.total_companies.toLocaleString(),
      icon: Building2,
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      shadow: 'shadow-blue-500/30',
      link: '/companies',
      description: 'Industry players',
    },
    {
      label: 'Products',
      value: summary.total_products.toLocaleString(),
      icon: Package,
      gradient: 'from-purple-500 via-violet-500 to-pink-500',
      shadow: 'shadow-purple-500/30',
      link: '/companies',
      description: ' semiconductor products',
    },
    {
      label: 'Relationships',
      value: summary.total_relationships.toLocaleString(),
      icon: Network,
      gradient: 'from-emerald-500 via-green-500 to-teal-500',
      shadow: 'shadow-green-500/30',
      link: '/knowledge-graph',
      description: 'Supply chain connections',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(summary.total_revenue),
      icon: TrendingUp,
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      shadow: 'shadow-orange-500/30',
      link: '/analysis',
      description: 'Combined market revenue',
    },
  ];

  return (
    <div className="space-y-8 animate-stagger">
      {/* Hero Section - Apple Premium */}
      <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-[2rem] p-10 text-white overflow-hidden shadow-2xl shadow-violet-500/20">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
        </div>
        
        {/* Glowing orb */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-violet-400/40 to-purple-400/40 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <span className="text-sm font-semibold text-violet-200">Real-time Intelligence</span>
              <h2 className="text-4xl font-bold tracking-tight mt-1">Semiconductor Industry Overview</h2>
            </div>
          </div>
          <p className="text-violet-100/80 text-lg max-w-2xl">
            Monitor supply chain relationships, track market dynamics, and explore company networks across the global semiconductor ecosystem.
          </p>
          
          {/* Quick Stats Row */}
          <div className="flex items-center gap-8 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                <Building2 size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary.total_companies.toLocaleString()}</p>
                <p className="text-xs text-violet-200">Companies</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                <Package size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary.total_products.toLocaleString()}</p>
                <p className="text-xs text-violet-200">Products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Apple Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, index) => (
          <Link
            key={card.label}
            to={card.link}
            className="group relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-lg shadow-black/5 border border-black/5 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient Top Bar */}
            <div className={`
              absolute top-0 left-4 right-4 h-1 
              bg-gradient-to-r ${card.gradient} 
              rounded-b-full opacity-0 group-hover:opacity-100 
              transition-all duration-300 shadow-lg
            `} />
            
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">{card.value}</p>
                <p className="text-xs text-gray-400 mt-1">{card.description}</p>
              </div>
              <div className={`
                p-4 rounded-2xl bg-gradient-to-br ${card.gradient} 
                shadow-lg ${card.shadow} 
                group-hover:scale-110 group-hover:rotate-3
                transition-all duration-300
              `}>
                <card.icon size={24} className="text-white" />
              </div>
            </div>
            
            <div className="mt-5 flex items-center text-sm font-semibold text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity gap-2">
              <span>Explore</span>
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-200" />
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Sector - Apple Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-7 shadow-lg shadow-black/5 border border-black/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <TrendingUp size={26} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Revenue by Sector</h3>
                <p className="text-sm text-gray-400">Top sectors by total revenue</p>
              </div>
            </div>
            <Link 
              to="/analysis" 
              className="group flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 px-4 py-2 rounded-xl hover:bg-violet-50 transition-all duration-200"
            >
              View all
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="space-y-5">
            {trends?.revenue_by_sector.slice(0, 5).map((sector, index) => {
              const percentage = Math.min((sector.total_revenue / (summary.total_revenue || 1)) * 100, 100);
              const colors = [
                'from-violet-500 to-purple-500',
                'from-blue-500 to-cyan-500',
                'from-emerald-500 to-green-500',
                'from-orange-500 to-amber-500',
                'from-pink-500 to-rose-500',
              ];
              return (
                <div key={sector.sector} className="group/item">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-sm font-semibold text-gray-700">{sector.sector || 'Unknown'}</span>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(sector.total_revenue)}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${colors[index]} rounded-full transition-all duration-1000 ease-out group-hover/item:shadow-lg`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Relationship Distribution - Apple Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-7 shadow-lg shadow-black/5 border border-black/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-violet-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Network size={26} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Relationship Types</h3>
                <p className="text-sm text-gray-400">Connection types in network</p>
              </div>
            </div>
            <Link 
              to="/knowledge-graph" 
              className="group flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 px-4 py-2 rounded-xl hover:bg-violet-50 transition-all duration-200"
            >
              View graph
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {trends?.relationship_distribution.slice(0, 6).map((rel, index) => {
              const colors = [
                'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 border-blue-200',
                'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 border-purple-200',
                'bg-gradient-to-br from-green-50 to-green-100 text-green-600 border-green-200',
                'bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 border-orange-200',
                'bg-gradient-to-br from-pink-50 to-pink-100 text-pink-600 border-pink-200',
                'bg-gradient-to-br from-cyan-50 to-cyan-100 text-cyan-600 border-cyan-200',
              ];
              return (
                <div
                  key={rel.type}
                  className={`
                    ${colors[index]} border rounded-2xl p-4 
                    hover:scale-105 hover:shadow-lg 
                    transition-all duration-200 cursor-pointer
                  `}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center shadow-sm">
                      <Network size={18} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wide">{rel.type}</span>
                  </div>
                  <p className="text-2xl font-bold">{rel.count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions - Apple Style */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-lg shadow-black/5 border border-black/5">
        <h3 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl shadow-lg shadow-violet-500/20">
            <Sparkles size={20} className="text-white" />
          </div>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            to="/knowledge-graph"
            className="group flex items-center gap-5 p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100/50 hover:from-violet-100 hover:to-purple-100 hover:border-violet-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="p-5 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-2xl shadow-lg shadow-violet-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Network size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-lg">Explore Knowledge Graph</p>
              <p className="text-sm text-gray-500 mt-1">Visualize company relationships</p>
            </div>
            <ArrowRight size={20} className="text-gray-400 group-hover:translate-x-2 group-hover:text-violet-500 transition-all duration-300" />
          </Link>

          <Link
            to="/companies"
            className="group flex items-center gap-5 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100/50 hover:from-blue-100 hover:to-cyan-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="p-5 bg-gradient-to-br from-blue-500 via-cyan-600 to-teal-600 rounded-2xl shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Building2 size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-lg">Browse Companies</p>
              <p className="text-sm text-gray-500 mt-1">View all industry players</p>
            </div>
            <ArrowRight size={20} className="text-gray-400 group-hover:translate-x-2 group-hover:text-blue-500 transition-all duration-300" />
          </Link>

          <Link
            to="/supply-chain"
            className="group flex items-center gap-5 p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100/50 hover:from-orange-100 hover:to-amber-100 hover:border-orange-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="p-5 bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 rounded-2xl shadow-lg shadow-orange-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Activity size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-lg">Supply Chain Analysis</p>
              <p className="text-sm text-gray-500 mt-1">View industry value flow</p>
            </div>
            <ArrowRight size={20} className="text-gray-400 group-hover:translate-x-2 group-hover:text-orange-500 transition-all duration-300" />
          </Link>
        </div>
      </div>

      {/* AI Assistant CTA */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-[2rem] p-10 text-white overflow-hidden shadow-2xl shadow-indigo-500/20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
        </div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20">
              <Zap size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Need Insights?</h3>
              <p className="text-indigo-100/80 mt-1 max-w-md">
                Ask our AI assistant about semiconductor industry trends, company relationships, or any technical questions.
              </p>
            </div>
          </div>
          <Link
            to="/assistant"
            className="flex items-center gap-3 px-8 py-4 bg-white text-violet-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <Sparkles size={20} />
            Try AI Assistant
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
