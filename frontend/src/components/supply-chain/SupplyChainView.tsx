import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analysisApi } from '../../services/api';
import type { SupplyChainStage } from '../../types';
import { Building2, Users, DollarSign, ChevronDown, ArrowRight, Globe } from 'lucide-react';

export function SupplyChainView() {
  const [supplyChain, setSupplyChain] = useState<SupplyChainStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await analysisApi.getSupplyChain();
        setSupplyChain(data);
      } catch (err) {
        setError('Failed to load supply chain data');
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
        <p className="text-[var(--text-secondary)] text-sm font-medium">Loading supply chain...</p>
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

  return (
    <div className="space-y-px">
      {/* Hero Header */}
      <div className="bg-[var(--bg-primary)] px-8 py-16 border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full" />
            <span className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-medium">Value Chain Analysis</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] tracking-tight leading-[1.1]">
            Supply<br />Chain
          </h1>
          <p className="text-[var(--text-secondary)] mt-6 max-w-xl text-base">
            探索完整的半导体产业链价值链，了解从设计到终端产品的完整生态系统
          </p>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-6 mt-8">
            <div className="flex items-center gap-3 bg-[var(--bg-secondary)] px-4 py-2 border border-[var(--border-color)]">
              <Globe size={16} className="text-[var(--text-secondary)]" />
              <span className="text-[var(--text-primary)] font-bold">{supplyChain.length}</span>
              <span className="text-[var(--text-secondary)] text-sm">Stages</span>
            </div>
            <div className="flex items-center gap-3 bg-[var(--bg-secondary)] px-4 py-2 border border-[var(--border-color)]">
              <Building2 size={16} className="text-[var(--text-secondary)]" />
              <span className="text-[var(--text-primary)] font-bold">
                {supplyChain.reduce((acc, s) => acc + s.company_count, 0)}
              </span>
              <span className="text-[var(--text-secondary)] text-sm">Companies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Supply Chain Stages */}
      <div className="bg-[var(--bg-primary)] px-8 py-10">
        <div className="max-w-6xl mx-auto space-y-2">
          {supplyChain.map((stage, index) => (
            <div key={stage.stage} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] overflow-hidden">
              {/* Stage Header */}
              <div
                className="p-6 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                onClick={() => setExpandedStage(expandedStage === stage.stage ? null : stage.stage)}
              >
                <div className="flex items-center gap-6">
                  {/* Number Badge */}
                  <div className="w-12 h-12 bg-[var(--bg-hover)] rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--text-secondary)] text-lg font-bold">{index + 1}</span>
                  </div>

                  {/* Stage Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-[var(--text-primary)]">{stage.stage}</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-hover)] px-3 py-1.5">
                          {stage.company_count} companies
                        </span>
                        <ChevronDown
                          size={20}
                          className={`text-[var(--text-secondary)] transition-transform duration-200 ${expandedStage === stage.stage ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="flex items-center gap-2 bg-[var(--bg-primary)] px-3 py-2.5 border border-[var(--border-color)]">
                        <DollarSign size={14} className="text-[var(--text-faint)]" />
                        <span className="text-sm font-semibold text-[var(--text-secondary)]">
                          {formatCurrency(stage.total_revenue)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-[var(--bg-primary)] px-3 py-2.5 border border-[var(--border-color)]">
                        <Users size={14} className="text-[var(--text-faint)]" />
                        <span className="text-sm font-semibold text-[var(--text-secondary)]">
                          {stage.total_employees.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-[var(--bg-primary)] px-3 py-2.5 border border-[var(--border-color)]">
                        <Building2 size={14} className="text-[var(--text-faint)]" />
                        <span className="text-sm font-semibold text-[var(--text-secondary)]">
                          {stage.company_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Companies List */}
              {expandedStage === stage.stage && (
                <div className="px-6 pb-6 pt-0 border-t border-[var(--border-color)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                    {stage.companies.map((company) => (
                      <Link
                        key={company.id}
                        to={`/companies/${company.id}`}
                        className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="w-10 h-10 bg-[var(--bg-hover)] rounded flex items-center justify-center flex-shrink-0">
                          <Building2 size={18} className="text-[var(--text-secondary)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[var(--text-primary)] text-sm truncate">{company.name}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{formatCurrency(company.revenue || 0)}</p>
                        </div>
                        <ArrowRight size={16} className="text-[var(--text-faint)]" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-[var(--bg-secondary)] px-8 py-10 border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Globe size={20} className="text-[var(--text-secondary)]" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Supply Chain Summary</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-5 py-5">
              <p className="text-[var(--text-secondary)] text-sm font-medium">Total Companies</p>
              <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">
                {supplyChain.reduce((acc, s) => acc + s.company_count, 0)}
              </p>
            </div>
            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-5 py-5">
              <p className="text-[var(--text-secondary)] text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">
                {formatCurrency(supplyChain.reduce((acc, s) => acc + s.total_revenue, 0))}
              </p>
            </div>
            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-5 py-5">
              <p className="text-[var(--text-secondary)] text-sm font-medium">Total Employees</p>
              <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">
                {supplyChain.reduce((acc, s) => acc + s.total_employees, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-5 py-5">
              <p className="text-[var(--text-secondary)] text-sm font-medium">Supply Chain Stages</p>
              <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">{supplyChain.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
