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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 bg-[var(--bg-primary)]">
        <div className="w-10 h-10 border border-[var(--border-color)] border-t-[var(--text-primary)] rounded-full animate-spin" />
        <p className="text-[var(--text-secondary)] text-sm font-medium">Loading analysis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-16 px-8">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6">
          <p className="text-[var(--text-primary)] font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const totalRelationships = trends?.relationship_distribution.reduce((acc, r) => acc + r.count, 0) || 0;

  return (
    <div className="space-y-px">
      {/* Hero Header */}
      <div className="bg-[var(--bg-primary)] px-8 py-16 border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full" />
            <span className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-medium">Market Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] tracking-tight leading-[1.1]">
            Trend<br />Analysis
          </h1>
          <p className="text-[var(--text-secondary)] mt-6 max-w-xl text-base">
            洞察半导体市场动态与趋势，分析行业格局变化
          </p>
        </div>
      </div>

      {/* Revenue by Sector */}
      <div className="bg-[var(--bg-primary)] px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <BarChart3 size={20} className="text-[var(--text-secondary)]" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Revenue by Sector</h3>
          </div>

          <div className="space-y-6">
            {trends?.revenue_by_sector.map((sector) => {
              const maxRevenue = Math.max(...(trends?.revenue_by_sector.map(s => s.total_revenue) || [1]));
              const percentage = (sector.total_revenue / maxRevenue) * 100;
              return (
                <div key={sector.sector}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--text-secondary)]">{sector.sector || 'Unknown'}</span>
                    <span className="text-sm font-bold text-[var(--text-primary)]">{formatCurrency(sector.total_revenue)}</span>
                  </div>
                  <div className="h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--text-primary)] rounded-full transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Market Share */}
      <div className="bg-[var(--bg-secondary)] px-8 py-10 border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <PieChart size={20} className="text-[var(--text-secondary)]" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Market Share by Supply Chain Stage</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {marketShare.map((share) => (
              <div
                key={share.stage}
                className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-5 py-5 hover:border-[var(--border-color-hover)] transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-[var(--text-primary)]">{share.stage || 'Unknown'}</span>
                  <span className="text-xs px-2 py-1 bg-[var(--bg-hover)] text-[var(--text-secondary)] font-medium">{share.company_count} companies</span>
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(share.total_revenue)}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Activity size={14} className="text-[var(--text-faint)]" />
                  <p className="text-sm text-[var(--text-secondary)]">
                    {formatCurrency(share.total_market_cap)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Relationship Distribution */}
      <div className="bg-[var(--bg-primary)] px-8 py-10 border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <Activity size={20} className="text-[var(--text-secondary)]" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Relationship Distribution</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {trends?.relationship_distribution.map((rel) => {
              const percentage = totalRelationships > 0 ? (rel.count / totalRelationships) * 100 : 0;
              return (
                <div 
                  key={rel.type} 
                  className="bg-[var(--bg-secondary)] border border-[var(--border-color)] px-4 py-5 text-center hover:border-[var(--border-color-hover)] transition-colors"
                >
                  <div className="text-2xl font-bold text-[var(--text-primary)]">{rel.count}</div>
                  <p className="text-xs text-[var(--text-secondary)] mt-2 font-medium uppercase tracking-wide">{rel.type}</p>
                  <div className="mt-3 bg-[var(--border-color)] rounded-full h-1 overflow-hidden">
                    <div
                      className="h-full bg-[var(--text-primary)] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-[var(--text-faint)] mt-2">{percentage.toFixed(1)}%</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-[var(--bg-secondary)] px-8 py-10 border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp size={20} className="text-[var(--text-secondary)]" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Key Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-5 py-5">
              <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wide">Top Sector by Revenue</p>
              <p className="text-xl font-bold text-[var(--text-primary)] mt-3">
                {trends?.revenue_by_sector[0]?.sector || 'N/A'}
              </p>
              <p className="text-3xl font-bold text-[var(--text-primary)] mt-3">
                {formatCurrency(trends?.revenue_by_sector[0]?.total_revenue || 0)}
              </p>
            </div>
            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-5 py-5">
              <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wide">Most Common Relationship</p>
              <p className="text-xl font-bold text-[var(--text-primary)] mt-3">
                {trends?.relationship_distribution[0]?.type || 'N/A'}
              </p>
              <p className="text-3xl font-bold text-[var(--text-primary)] mt-3">
                {trends?.relationship_distribution[0]?.count || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
