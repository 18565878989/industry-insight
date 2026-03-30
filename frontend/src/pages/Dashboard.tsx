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
  Eye,
  Cpu,
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
      <div className="flex flex-col items-center justify-center h-[70vh] gap-8">
        {/* Apple Skeleton Loading */}
        <div className="relative">
          <div className="w-24 h-24 border-4 border-violet-200 border-t-violet-600 rounded-full animate-apple-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-violet-600 animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-gray-600 font-semibold text-xl tracking-wide">Loading insights...</p>
          <p className="text-gray-400 text-sm">Fetching latest semiconductor data</p>
        </div>
        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-6xl px-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="apple-skeleton-card animate-pulse">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="apple-skeleton-line w-24 h-4" />
                  <div className="apple-skeleton-line w-16 h-8" />
                </div>
                <div className="apple-skeleton-circle w-14 h-14" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="apple-alert apple-alert-error max-w-2xl mx-auto mt-8 animate-spring-in">
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
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Products',
      value: summary.total_products.toLocaleString(),
      icon: Package,
      gradient: 'from-purple-500 via-violet-500 to-pink-500',
      shadow: 'shadow-purple-500/30',
      link: '/companies',
      description: 'semiconductor products',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Relationships',
      value: summary.total_relationships.toLocaleString(),
      icon: Network,
      gradient: 'from-emerald-500 via-green-500 to-teal-500',
      shadow: 'shadow-green-500/30',
      link: '/knowledge-graph',
      description: 'Supply chain connections',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(summary.total_revenue),
      icon: TrendingUp,
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      shadow: 'shadow-orange-500/30',
      link: '/analysis',
      description: 'Combined market revenue',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section - Apple Premium v3 */}
      <div className="relative apple-hero-mesh p-12 text-white overflow-hidden shadow-2xl shadow-violet-500/25">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-2 h-2 bg-white/30 rounded-full animate-float" />
          <div className="absolute top-20 right-20 w-3 h-3 bg-white/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-16 left-1/4 w-2 h-2 bg-white/25 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-white/15 rounded-full animate-breathe-glow" />
        </div>
        
        <div className="relative">
          <div className="flex items-start justify-between gap-8">
            <div className="flex items-center gap-5 mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <span className="text-sm font-semibold text-violet-200 tracking-wide">Real-time Intelligence</span>
                <h2 className="text-5xl font-bold tracking-tight mt-1 bg-gradient-to-r from-white to-violet-100 bg-clip-text text-transparent">
                  Semiconductor Industry Overview
                </h2>
              </div>
            </div>
            
            {/* Quick Stats Pills */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/15 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/20">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white font-semibold">{summary.total_companies.toLocaleString()}</span>
                <span className="text-violet-200 text-sm">Companies</span>
              </div>
              <div className="flex items-center gap-3 bg-white/15 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/20">
                <Cpu className="w-5 h-5 text-violet-200" />
                <span className="text-white font-semibold">{summary.total_products.toLocaleString()}</span>
                <span className="text-violet-200 text-sm">Products</span>
              </div>
            </div>
          </div>
          
          <p className="text-white/80 text-lg max-w-3xl leading-relaxed">
            Monitor supply chain relationships, track market dynamics, and explore company networks across the global semiconductor ecosystem.
          </p>
        </div>
      </div>

      {/* Stats Grid - Apple Cards v3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Link
            key={card.label}
            to={card.link}
            className="group apple-card-interactive animate-scale-in"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* Gradient Top Bar */}
            <div className={`
              absolute top-0 left-6 right-6 h-1.5 
              bg-gradient-to-r ${card.gradient} 
              rounded-b-2xl opacity-0 group-hover:opacity-100 
              transition-all duration-500 shadow-lg
            `} />
            
            <div className="flex items-start justify-between relative">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-500 tracking-wide">{card.label}</p>
                <p className="text-4xl font-bold text-gray-900 mt-3 tracking-tight gradient-text-fusion">
                  {card.value}
                </p>
                <p className="text-xs text-gray-400 mt-2">{card.description}</p>
              </div>
              <div className={`
                p-4 rounded-2xl bg-gradient-to-br ${card.gradient} 
                shadow-lg ${card.shadow} 
                group-hover:scale-110 group-hover:rotate-6
                transition-all duration-300
              `}>
                <card.icon size={26} className="text-white" />
              </div>
            </div>
            
            <div className="mt-6 flex items-center text-sm font-bold text-violet-600 opacity-0 group-hover:opacity-100 transition-all duration-300 gap-2">
              <span>Explore</span>
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-200" />
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Sector - Apple Card */}
        <div className="apple-card-interactive p-8 animate-scale-in" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <TrendingUp size={28} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-xl tracking-tight">Revenue by Sector</h3>
                <p className="text-sm text-gray-500 mt-1">Top sectors by total revenue</p>
              </div>
            </div>
            <Link 
              to="/analysis" 
              className="group flex items-center gap-2 text-sm font-bold text-violet-600 hover:text-violet-700 px-5 py-2.5 rounded-xl hover:bg-violet-50 transition-all duration-200"
            >
              View all
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="space-y-6">
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
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">{sector.sector || 'Unknown'}</span>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(sector.total_revenue)}</span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${colors[index]} rounded-full transition-all duration-1000 ease-out group-hover/item:shadow-lg group-hover/item:scale-y-110`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Relationship Distribution - Apple Card */}
        <div className="apple-card-interactive p-8 animate-scale-in" style={{ animationDelay: '480ms' }}>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-violet-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <Network size={28} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-xl tracking-tight">Relationship Types</h3>
                <p className="text-sm text-gray-500 mt-1">Connection types in network</p>
              </div>
            </div>
            <Link 
              to="/knowledge-graph" 
              className="group flex items-center gap-2 text-sm font-bold text-violet-600 hover:text-violet-700 px-5 py-2.5 rounded-xl hover:bg-violet-50 transition-all duration-200"
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
                    ${colors[index]} border-2 rounded-2xl p-5 
                    hover:scale-105 hover:shadow-xl 
                    transition-all duration-200 cursor-pointer
                    animate-scale-in
                  `}
                  style={{ animationDelay: `${560 + index * 60}ms` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center shadow-sm">
                      <Network size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">{rel.type}</span>
                  </div>
                  <p className="text-3xl font-bold">{rel.count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions - Apple Style v3 */}
      <div className="apple-card-interactive p-10 animate-scale-in" style={{ animationDelay: '600ms' }}>
        <h3 className="font-bold text-gray-900 text-2xl mb-8 flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl shadow-lg shadow-violet-500/20">
            <Sparkles size={22} className="text-white" />
          </div>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/knowledge-graph"
            className="group flex items-center gap-6 p-8 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border-2 border-violet-100/50 hover:from-violet-100 hover:to-purple-100 hover:border-violet-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="p-6 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-2xl shadow-xl shadow-violet-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Network size={30} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-xl tracking-tight">Explore Knowledge Graph</p>
              <p className="text-sm text-gray-500 mt-2">Visualize company relationships</p>
            </div>
            <ArrowRight size={22} className="text-gray-400 group-hover:translate-x-3 group-hover:text-violet-500 transition-all duration-300" />
          </Link>

          <Link
            to="/companies"
            className="group flex items-center gap-6 p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100/50 hover:from-blue-100 hover:to-cyan-100 hover:border-blue-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="p-6 bg-gradient-to-br from-blue-500 via-cyan-600 to-teal-600 rounded-2xl shadow-xl shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Building2 size={30} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-xl tracking-tight">Browse Companies</p>
              <p className="text-sm text-gray-500 mt-2">View all industry players</p>
            </div>
            <ArrowRight size={22} className="text-gray-400 group-hover:translate-x-3 group-hover:text-blue-500 transition-all duration-300" />
          </Link>

          <Link
            to="/supply-chain"
            className="group flex items-center gap-6 p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-100/50 hover:from-orange-100 hover:to-amber-100 hover:border-orange-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="p-6 bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 rounded-2xl shadow-xl shadow-orange-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Activity size={30} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-xl tracking-tight">Supply Chain Analysis</p>
              <p className="text-sm text-gray-500 mt-2">View industry value flow</p>
            </div>
            <ArrowRight size={22} className="text-gray-400 group-hover:translate-x-3 group-hover:text-orange-500 transition-all duration-300" />
          </Link>
        </div>
      </div>

      {/* AI Assistant CTA - Premium */}
      <div className="relative apple-hero-mesh p-12 text-white overflow-hidden shadow-2xl animate-scale-in" style={{ animationDelay: '720ms' }}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full animate-breathing-glow" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-400/20 rounded-full animate-breathing-glow" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative flex items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl">
              <Zap size={36} className="text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold tracking-tight">Need Insights?</h3>
              <p className="text-indigo-100/80 mt-2 max-w-xl text-lg leading-relaxed">
                Ask our AI assistant about semiconductor industry trends, company relationships, or any technical questions.
              </p>
            </div>
          </div>
          <Link
            to="/assistant"
            className="flex items-center gap-4 px-10 py-5 bg-white text-violet-700 font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 whitespace-nowrap"
          >
            <Sparkles size={22} />
            Try AI Assistant
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
