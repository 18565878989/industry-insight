import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Building2, MapPin, Users, DollarSign, Sparkles, X, Grid, List } from 'lucide-react';
import { companiesApi } from '../../services/api';
import type { Company } from '../../types';

export function CompanyList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('');
  const [stage, setStage] = useState('');
  const [sectors, setSectors] = useState<string[]>([]);
  const [stages, setStages] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function fetchFilters() {
      try {
        const [sectorsData, stagesData] = await Promise.all([
          companiesApi.getSectors(),
          companiesApi.getSupplyChainStages(),
        ]);
        setSectors(sectorsData);
        setStages(stagesData);
      } catch (err) {
        console.error('Failed to fetch filters:', err);
      }
    }
    fetchFilters();
  }, []);

  useEffect(() => {
    async function fetchCompanies() {
      setLoading(true);
      setError(null);
      try {
        const data = await companiesApi.getAll({
          page,
          per_page: 12,
          search: search || undefined,
          sector: sector || undefined,
          supply_chain_stage: stage || undefined,
        });
        setCompanies(data.companies);
        setTotalPages(data.pages);
        setTotal(data.total);
      } catch (err) {
        setError('Failed to load companies');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, [page, search, sector, stage]);

  const formatCurrency = (value: number | null) => {
    if (!value) return '-';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toFixed(0)}`;
  };

  const getStageColor = (stage: string | null) => {
    switch (stage) {
      case 'Design': return 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-purple-200';
      case 'EDA Tools': return 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 border-violet-200';
      case 'Manufacturing': return 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200';
      case 'Equipment': return 'bg-gradient-to-r from-cyan-50 to-teal-50 text-cyan-700 border-cyan-200';
      case 'Materials': return 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200';
      case 'Packaging/Testing': return 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200';
      case 'End Products': return 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSector('');
    setStage('');
    setPage(1);
  };

  const hasActiveFilters = search || sector || stage;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
        </div>
        
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-400/30 rounded-full blur-3xl" />
        
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-400">Industry Directory</span>
              <h1 className="text-4xl font-bold tracking-tight mt-1">半导体企业列表</h1>
            </div>
          </div>
          <p className="text-gray-400 text-lg">浏览完整的半导体产业链企业</p>
        </div>
      </div>

      {/* Filters - Apple Glass Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-black/5 p-5">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-100/80 border-2 border-transparent rounded-2xl text-sm focus:outline-none focus:bg-white focus:border-violet-300 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200"
            />
          </div>

          {/* Sector filter */}
          <select
            value={sector}
            onChange={(e) => { setSector(e.target.value); setPage(1); }}
            className="px-5 py-3.5 bg-gray-100/80 border-2 border-transparent rounded-2xl text-sm focus:outline-none focus:bg-white focus:border-violet-300 focus:ring-4 focus:ring-violet-500/10 cursor-pointer transition-all duration-200 min-w-[160px]"
          >
            <option value="">All Sectors</option>
            {sectors.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Stage filter */}
          <select
            value={stage}
            onChange={(e) => { setStage(e.target.value); setPage(1); }}
            className="px-5 py-3.5 bg-gray-100/80 border-2 border-transparent rounded-2xl text-sm focus:outline-none focus:bg-white focus:border-violet-300 focus:ring-4 focus:ring-violet-500/10 cursor-pointer transition-all duration-200 min-w-[180px]"
          >
            <option value="">All Supply Chain Stages</option>
            {stages.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-5 py-3.5 bg-red-50 text-red-600 rounded-2xl text-sm font-semibold hover:bg-red-100 transition-colors"
            >
              <X size={16} />
              Clear
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-violet-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-violet-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-violet-500" />
          <p className="text-sm text-gray-500">
            Showing <span className="font-bold text-gray-900">{companies.length}</span> of <span className="font-bold text-violet-600">{total}</span> companies
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-80 gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-violet-600 animate-pulse" />
          </div>
          <p className="text-gray-600 font-semibold text-lg">Loading companies...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="apple-alert apple-alert-error">
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Error</h3>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* Company Grid/List */}
      {!loading && !error && (
        <>
          {companies.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-black/5 p-16 text-center shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Building2 size={40} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-stagger' : 'space-y-4'}>
              {companies.map((company) => (
                <Link
                  key={company.id}
                  to={`/companies/${company.id}`}
                  className={`
                    group bg-white/95 backdrop-blur-xl rounded-2xl p-6 
                    shadow-lg shadow-black/5 border border-black/5 
                    hover:shadow-xl hover:-translate-y-2 
                    transition-all duration-300
                    ${viewMode === 'list' ? 'flex items-center gap-6' : ''}
                  `}
                >
                  <div className={viewMode === 'grid' ? 'mb-4' : 'flex-shrink-0'}>
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <Building2 size={26} className="text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-violet-600 transition-colors line-clamp-1">
                      {company.name}
                    </h3>
                    {company.headquarters && (
                      <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                        <MapPin size={12} />
                        {company.headquarters}
                      </p>
                    )}

                    {company.supply_chain_stage && (
                      <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-xl border mt-3 ${getStageColor(company.supply_chain_stage)}`}>
                        {company.supply_chain_stage}
                      </span>
                    )}

                    <div className={`grid gap-3 mt-4 pt-4 border-t border-gray-100 ${viewMode === 'list' ? 'grid-cols-2' : 'grid-cols-2'}`}>
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-green-50 rounded-xl">
                          <DollarSign size={16} className="text-green-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{formatCurrency(company.revenue)}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-50 rounded-xl">
                          <Users size={16} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {company.employees ? company.employees.toLocaleString() : '-'}
                        </span>
                      </div>
                    </div>

                    {company.sector && (
                      <p className="text-xs text-gray-400 mt-3 truncate">{company.sector}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination - Apple Style */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-3 bg-white/95 backdrop-blur-xl rounded-2xl border border-black/5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:shadow-lg transition-all duration-200"
              >
                <ChevronLeft size={22} className="text-gray-600" />
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`
                        w-12 h-12 rounded-xl font-bold text-sm transition-all duration-200
                        ${page === pageNum
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                          : 'bg-white/95 backdrop-blur-xl text-gray-600 hover:bg-white hover:shadow-md border border-black/5'
                        }
                      `}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-3 bg-white/95 backdrop-blur-xl rounded-2xl border border-black/5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:shadow-lg transition-all duration-200"
              >
                <ChevronRight size={22} className="text-gray-600" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
