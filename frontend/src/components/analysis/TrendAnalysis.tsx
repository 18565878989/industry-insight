import { useEffect, useState } from 'react';
import { analysisApi } from '../../services/api';
import type { TrendData, MarketShare } from '../../types';
import { TrendingUp, PieChart, BarChart3, Activity } from 'lucide-react';

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
      'bg-purple-500',
      'bg-violet-500',
      'bg-blue-500',
      'bg-cyan-500',
      'bg-teal-500',
      'bg-amber-500',
      'bg-red-500',
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  const totalRelationships = trends?.relationship_distribution.reduce((acc, r) => acc + r.count, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Revenue by Sector */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <BarChart3 size={24} className="text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Revenue by Sector</h3>
            <p className="text-sm text-slate-500">Total revenue distribution across semiconductor sectors</p>
          </div>
        </div>

        <div className="space-y-4">
          {trends?.revenue_by_sector.map((sector, index) => {
            const maxRevenue = Math.max(...(trends?.revenue_by_sector.map(s => s.total_revenue) || [1]));
            return (
              <div key={sector.sector} className="flex items-center gap-4">
                <div className="w-32 text-sm text-slate-600 truncate">{sector.sector || 'Unknown'}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                  <div
                    className={`h-full ${getStageColor(index)} rounded-full transition-all duration-500`}
                    style={{ width: `${(sector.total_revenue / maxRevenue) * 100}%` }}
                  />
                </div>
                <div className="w-28 text-sm font-medium text-slate-800 text-right">
                  {formatCurrency(sector.total_revenue)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Share */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <PieChart size={24} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Market Share by Supply Chain Stage</h3>
            <p className="text-sm text-slate-500">Revenue distribution across supply chain stages</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketShare.map((share, index) => (
            <div
              key={share.stage}
              className={`${getStageColor(index)} rounded-xl p-4 text-white`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{share.stage || 'Unknown'}</span>
                <span className="text-xs opacity-75">{share.company_count} companies</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(share.total_revenue)}</p>
              <p className="text-xs opacity-75 mt-1">
                Market Cap: {formatCurrency(share.total_market_cap)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Relationship Distribution */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Activity size={24} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Relationship Distribution</h3>
            <p className="text-sm text-slate-500">Types of connections between companies in the network</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trends?.relationship_distribution.map((rel) => {
            const percentage = totalRelationships > 0 ? (rel.count / totalRelationships) * 100 : 0;
            return (
              <div key={rel.type} className="bg-slate-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-slate-800">{rel.count}</div>
                <p className="text-xs text-slate-500 mt-1">{rel.type}</p>
                <div className="mt-2 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">{percentage.toFixed(1)}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/10 rounded-lg">
            <TrendingUp size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold">Key Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-sm text-slate-300">Top Sector by Revenue</p>
            <p className="text-lg font-semibold mt-1">
              {trends?.revenue_by_sector[0]?.sector || 'N/A'}
            </p>
            <p className="text-2xl font-bold text-primary-400 mt-1">
              {formatCurrency(trends?.revenue_by_sector[0]?.total_revenue || 0)}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-sm text-slate-300">Most Common Relationship</p>
            <p className="text-lg font-semibold mt-1">
              {trends?.relationship_distribution[0]?.type || 'N/A'}
            </p>
            <p className="text-2xl font-bold text-green-400 mt-1">
              {trends?.relationship_distribution[0]?.count || 0} connections
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
