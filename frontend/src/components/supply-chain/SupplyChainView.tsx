import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analysisApi } from '../../services/api';
import type { SupplyChainStage } from '../../types';
import { Building2, Users, DollarSign, ChevronRight, ArrowRight } from 'lucide-react';

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

  const getStageBgColor = (index: number) => {
    const colors = [
      'bg-purple-50 border-purple-200',
      'bg-violet-50 border-violet-200',
      'bg-blue-50 border-blue-200',
      'bg-cyan-50 border-cyan-200',
      'bg-teal-50 border-teal-200',
      'bg-amber-50 border-amber-200',
      'bg-red-50 border-red-200',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Semiconductor Supply Chain</h2>
        <p className="text-slate-600">
          Explore the complete semiconductor industry value chain from design to end products
        </p>
      </div>

      {/* Supply Chain Flow */}
      <div className="relative">
        {/* Connection Lines */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 via-cyan-500 via-teal-500 via-amber-500 to-red-500 transform -translate-x-1/2 hidden lg:block" />

        {/* Stages */}
        <div className="space-y-4">
          {supplyChain.map((stage, index) => (
            <div key={stage.stage} className="relative">
              {/* Stage Card */}
              <div
                className={`bg-white rounded-xl p-5 shadow-sm border-2 transition-all cursor-pointer ${
                  getStageBgColor(index)
                } ${expandedStage === stage.stage ? 'ring-2 ring-primary-500' : ''}`}
                onClick={() => setExpandedStage(expandedStage === stage.stage ? null : stage.stage)}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`${getStageColor(index)} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-xl font-bold">{index + 1}</span>
                  </div>

                  {/* Stage Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-800">{stage.stage}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">
                          {stage.company_count} companies
                        </span>
                        <ChevronRight
                          size={20}
                          className={`text-slate-400 transition-transform ${expandedStage === stage.stage ? 'rotate-90' : ''}`}
                        />
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <DollarSign size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {formatCurrency(stage.total_revenue)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {stage.total_employees.toLocaleString()} employees
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {stage.company_count} companies
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Companies List */}
                {expandedStage === stage.stage && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {stage.companies.map((company) => (
                        <Link
                          key={company.id}
                          to={`/companies/${company.id}`}
                          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-primary-300 hover:shadow-sm transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className={`${getStageColor(index)} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Building2 size={14} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-800 truncate">{company.name}</p>
                            <p className="text-xs text-slate-500">{formatCurrency(company.revenue || 0)}</p>
                          </div>
                          <ArrowRight size={14} className="text-slate-300" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Flow Arrow (desktop) */}
              {index < supplyChain.length - 1 && (
                <div className="hidden lg:flex items-center justify-center py-2">
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-slate-300" />
                    <span className="text-xs">flows to</span>
                    <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-slate-300" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Supply Chain Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-primary-100 text-sm">Total Companies</p>
            <p className="text-2xl font-bold">
              {supplyChain.reduce((acc, s) => acc + s.company_count, 0)}
            </p>
          </div>
          <div>
            <p className="text-primary-100 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold">
              {formatCurrency(supplyChain.reduce((acc, s) => acc + s.total_revenue, 0))}
            </p>
          </div>
          <div>
            <p className="text-primary-100 text-sm">Total Employees</p>
            <p className="text-2xl font-bold">
              {supplyChain.reduce((acc, s) => acc + s.total_employees, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-primary-100 text-sm">Supply Chain Stages</p>
            <p className="text-2xl font-bold">{supplyChain.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
