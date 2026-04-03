import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Package,
  Network,
  TrendingUp,
  ArrowRight,
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
      <div className="flex flex-col items-center justify-center h-[80vh] gap-8">
        <div className="w-10 h-10 border border-[var(--border-color)] border-t-[var(--text-primary)] rounded-full animate-spin" />
        <div className="text-center">
          <p className="text-[var(--text-secondary)] text-sm font-medium">Loading insights...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px w-full max-w-6xl px-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="skeleton-dark w-20 h-3 rounded" />
                  <div className="skeleton-dark w-16 h-8 rounded" />
                </div>
                <div className="skeleton-dark w-10 h-10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="max-w-2xl mx-auto mt-16 px-8">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6">
          <p className="text-[var(--text-primary)] font-medium">{error || 'Failed to load dashboard data'}</p>
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
      link: '/companies',
    },
    {
      label: 'Products',
      value: summary.total_products.toLocaleString(),
      icon: Package,
      link: '/companies',
    },
    {
      label: 'Relationships',
      value: summary.total_relationships.toLocaleString(),
      icon: Network,
      link: '/knowledge-graph',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(summary.total_revenue),
      icon: TrendingUp,
      link: '/analysis',
    },
  ];

  return (
    <div className="space-y-px">
      {/* Hero Section */}
      <div className="bg-[var(--bg-primary)] px-8 py-16 border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full" />
            <span className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-medium">Semiconductor Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] tracking-tight leading-[1.1]">
            Industry<br />Overview
          </h1>
          <p className="text-[var(--text-secondary)] mt-6 max-w-xl text-base leading-relaxed">
            Monitor supply chain relationships, track market dynamics, and explore company networks across the global semiconductor ecosystem.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border-color)]">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-[var(--bg-primary)] px-8 py-8 hover:bg-[var(--bg-hover)] transition-colors duration-200 group"
          >
            <div className="flex flex-col h-full">
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-4 font-medium">{card.label}</p>
              <p className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">{card.value}</p>
              <div className="mt-auto pt-6 flex items-center justify-between">
                <div className="w-10 h-10 border border-[var(--border-color)] rounded-full flex items-center justify-center group-hover:border-[var(--border-color-hover)] transition-colors">
                  <card.icon size={18} className="text-[var(--text-secondary)]" />
                </div>
                <ArrowRight size={16} className="text-[var(--text-faint)] group-hover:text-[var(--text-secondary)] transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[var(--border-color)]">
        {/* Revenue by Sector */}
        <div className="bg-[var(--bg-primary)] px-8 py-10">
          <div className="flex items-center gap-3 mb-10">
            <TrendingUp size={20} className="text-[var(--text-secondary)]" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Revenue by Sector</h3>
          </div>
          
          <div className="space-y-6">
            {trends?.revenue_by_sector.slice(0, 5).map((sector) => {
              const percentage = Math.min((sector.total_revenue / (summary.total_revenue || 1)) * 100, 100);
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

        {/* Relationship Types */}
        <div className="bg-[var(--bg-primary)] px-8 py-10">
          <div className="flex items-center gap-3 mb-10">
            <Network size={20} className="text-[var(--text-secondary)]" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Relationship Types</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {trends?.relationship_distribution.slice(0, 6).map((rel) => (
              <div
                key={rel.type}
                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] px-4 py-5 text-center hover:bg-[var(--bg-hover)] transition-colors"
              >
                <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">{rel.type}</span>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-2">{rel.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[var(--bg-primary)] px-8 py-10 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-3 mb-8">
          <Cpu size={20} className="text-[var(--text-secondary)]" />
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link
            to="/knowledge-graph"
            className="flex items-center gap-5 px-6 py-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors group"
          >
            <div className="w-12 h-12 border border-[var(--border-color)] rounded-full flex items-center justify-center group-hover:border-[var(--border-color-hover)] transition-colors">
              <Network size={20} className="text-[var(--text-secondary)]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[var(--text-primary)] text-sm">Knowledge Graph</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Visualize relationships</p>
            </div>
            <ArrowRight size={16} className="text-[var(--text-faint)]" />
          </Link>

          <Link
            to="/companies"
            className="flex items-center gap-5 px-6 py-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors group"
          >
            <div className="w-12 h-12 border border-[var(--border-color)] rounded-full flex items-center justify-center group-hover:border-[var(--border-color-hover)] transition-colors">
              <Building2 size={20} className="text-[var(--text-secondary)]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[var(--text-primary)] text-sm">Companies</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">View industry players</p>
            </div>
            <ArrowRight size={16} className="text-[var(--text-faint)]" />
          </Link>

          <Link
            to="/assistant"
            className="flex items-center gap-5 px-6 py-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors group"
          >
            <div className="w-12 h-12 border border-[var(--border-color)] rounded-full flex items-center justify-center group-hover:border-[var(--border-color-hover)] transition-colors">
              <Cpu size={20} className="text-[var(--text-secondary)]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[var(--text-primary)] text-sm">AI Assistant</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Get deeper insights</p>
            </div>
            <ArrowRight size={16} className="text-[var(--text-faint)]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
