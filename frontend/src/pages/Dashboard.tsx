import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Package,
  Network,
  TrendingUp,
  ArrowRight,
  Activity,
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error || 'Failed to load data'}
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
      value: summary.total_companies.toString(),
      icon: Building2,
      color: 'bg-blue-500',
      link: '/companies',
    },
    {
      label: 'Products',
      value: summary.total_products.toString(),
      icon: Package,
      color: 'bg-purple-500',
      link: '/companies',
    },
    {
      label: 'Relationships',
      value: summary.total_relationships.toString(),
      icon: Network,
      color: 'bg-green-500',
      link: '/knowledge-graph',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(summary.total_revenue),
      icon: TrendingUp,
      color: 'bg-orange-500',
      link: '/analysis',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-primary-200 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              View details <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Sector */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Revenue by Sector</h3>
            <Link to="/analysis" className="text-primary-600 text-sm font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {trends?.revenue_by_sector.slice(0, 5).map((sector) => (
              <div key={sector.sector} className="flex items-center gap-4">
                <div className="w-24 text-sm text-slate-600 truncate">{sector.sector}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                    style={{
                      width: `${Math.min((sector.total_revenue / (summary.total_revenue || 1)) * 100, 100)}%`,
                    }}
                  />
                </div>
                <div className="w-20 text-sm font-medium text-slate-800 text-right">
                  {formatCurrency(sector.total_revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Relationship Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Relationship Types</h3>
            <Link to="/knowledge-graph" className="text-primary-600 text-sm font-medium hover:underline">
              View graph
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {trends?.relationship_distribution.map((rel) => (
              <div
                key={rel.type}
                className="bg-slate-50 rounded-lg p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Network size={20} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{rel.type}</p>
                  <p className="text-xs text-slate-500">{rel.count} connections</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/knowledge-graph"
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg hover:from-primary-100 hover:to-primary-150 transition-colors"
          >
            <div className="p-3 bg-primary-500 rounded-lg">
              <Network size={24} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Explore Knowledge Graph</p>
              <p className="text-sm text-slate-600">Visualize company relationships</p>
            </div>
          </Link>

          <Link
            to="/companies"
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-150 transition-colors"
          >
            <div className="p-3 bg-green-500 rounded-lg">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Browse Companies</p>
              <p className="text-sm text-slate-600">View all industry players</p>
            </div>
          </Link>

          <Link
            to="/supply-chain"
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-150 transition-colors"
          >
            <div className="p-3 bg-orange-500 rounded-lg">
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Supply Chain Analysis</p>
              <p className="text-sm text-slate-600">View industry flow</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
