import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analysisApi } from '../../services/api';
import type { SupplyChainStage } from '../../types';
import { Building2, Users, DollarSign, ChevronDown, ArrowRight, Sparkles, Globe } from 'lucide-react';

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

  const getStageBgColor = (index: number) => {
    const colors = [
      'bg-purple-50/80 border-purple-100',
      'bg-violet-50/80 border-violet-100',
      'bg-blue-50/80 border-blue-100',
      'bg-cyan-50/80 border-cyan-100',
      'bg-teal-50/80 border-teal-100',
      'bg-amber-50/80 border-amber-100',
      'bg-red-50/80 border-red-100',
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-emerald-600 animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-gray-600 font-semibold text-lg">Loading supply chain...</p>
          <p className="text-gray-400 text-sm mt-1">Building value chain visualization</p>
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

  return (
    <div className="space-y-6">
      {/* Hero Header - Apple Style */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-emerald-500/20">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
        </div>
        
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-400/40 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <span className="text-sm font-semibold text-emerald-200">Value Chain Analysis</span>
              <h2 className="text-4xl font-bold tracking-tight mt-1">半导体供应链</h2>
            </div>
          </div>
          <p className="text-emerald-100/80 text-lg max-w-2xl">
            探索完整的半导体产业链价值链，了解从设计到终端产品的完整生态系统
          </p>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-6 mt-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/20">
              <Globe className="w-5 h-5 text-emerald-200" />
              <span className="text-white font-bold">{supplyChain.length}</span>
              <span className="text-emerald-200 text-sm">Stages</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/20">
              <Building2 className="w-5 h-5 text-emerald-200" />
              <span className="text-white font-bold">
                {supplyChain.reduce((acc, s) => acc + s.company_count, 0)}
              </span>
              <span className="text-emerald-200 text-sm">Companies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Supply Chain Flow - Timeline Style */}
      <div className="relative">
        {/* Timeline Connector */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-blue-500 via-cyan-500 via-teal-500 via-amber-500 to-red-500 hidden lg:block rounded-full" />

        {/* Stages */}
        <div className="space-y-5 lg:pl-20">
          {supplyChain.map((stage, index) => (
            <div key={stage.stage} className="relative">
              {/* Stage Card - Apple Style */}
              <div
                className={`
                  bg-white/95 backdrop-blur-xl rounded-2xl p-6 
                  shadow-lg shadow-black/5 
                  border-2 transition-all duration-300 cursor-pointer
                  ${getStageBgColor(index)}
                  ${expandedStage === stage.stage ? 'ring-4 ring-violet-500/20 shadow-xl' : ''}
                  hover:shadow-xl hover:-translate-y-1
                `}
                onClick={() => setExpandedStage(expandedStage === stage.stage ? null : stage.stage)}
              >
                <div className="flex items-center gap-5">
                  {/* Number Badge */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${getStageColor(index)} rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <span className="text-white text-2xl font-bold">{index + 1}</span>
                  </div>

                  {/* Stage Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">{stage.stage}</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-gray-500 bg-white/80 px-4 py-2 rounded-xl">
                          {stage.company_count} companies
                        </span>
                        <ChevronDown
                          size={22}
                          className={`text-gray-400 transition-transform duration-300 ${expandedStage === stage.stage ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-3 bg-white/80 rounded-xl p-3.5 hover:shadow-md transition-shadow">
                        <div className="p-2.5 bg-green-100 rounded-xl">
                          <DollarSign size={18} className="text-green-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">
                          {formatCurrency(stage.total_revenue)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 bg-white/80 rounded-xl p-3.5 hover:shadow-md transition-shadow">
                        <div className="p-2.5 bg-blue-100 rounded-xl">
                          <Users size={18} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">
                          {stage.total_employees.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 bg-white/80 rounded-xl p-3.5 hover:shadow-md transition-shadow">
                        <div className="p-2.5 bg-purple-100 rounded-xl">
                          <Building2 size={18} className="text-purple-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">
                          {stage.company_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Companies List - Apple Cards */}
                {expandedStage === stage.stage && (
                  <div className="mt-6 pt-6 border-t border-gray-200/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {stage.companies.map((company) => (
                        <Link
                          key={company.id}
                          to={`/companies/${company.id}`}
                          className="flex items-center gap-4 p-4 bg-white/80 rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className={`w-12 h-12 bg-gradient-to-br ${getStageColor(index)} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                            <Building2 size={20} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 truncate">{company.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatCurrency(company.revenue || 0)}</p>
                          </div>
                          <ArrowRight size={18} className="text-gray-300" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Flow Arrow (desktop) */}
              {index < supplyChain.length - 1 && (
                <div className="hidden lg:flex items-center justify-center py-4">
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="w-16 h-1 bg-gradient-to-r from-transparent to-gray-300 rounded-full" />
                    <span className="text-xs font-bold uppercase tracking-widest">flows to</span>
                    <div className="w-16 h-1 bg-gradient-to-l from-transparent to-gray-300 rounded-full" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary - Apple Hero Card */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-violet-500/20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-7 h-7 text-violet-200" />
            <h3 className="text-2xl font-bold">Supply Chain Summary</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:bg-white/20 transition-colors">
              <p className="text-violet-200 text-sm font-semibold">Total Companies</p>
              <p className="text-4xl font-bold mt-2">
                {supplyChain.reduce((acc, s) => acc + s.company_count, 0)}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:bg-white/20 transition-colors">
              <p className="text-violet-200 text-sm font-semibold">Total Revenue</p>
              <p className="text-4xl font-bold mt-2">
                {formatCurrency(supplyChain.reduce((acc, s) => acc + s.total_revenue, 0))}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:bg-white/20 transition-colors">
              <p className="text-violet-200 text-sm font-semibold">Total Employees</p>
              <p className="text-4xl font-bold mt-2">
                {supplyChain.reduce((acc, s) => acc + s.total_employees, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:bg-white/20 transition-colors">
              <p className="text-violet-200 text-sm font-semibold">Supply Chain Stages</p>
              <p className="text-4xl font-bold mt-2">{supplyChain.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
