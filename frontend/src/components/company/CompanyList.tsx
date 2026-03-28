import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Building2, MapPin, Users, DollarSign } from 'lucide-react';
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
      case 'Design': return 'bg-purple-100 text-purple-700';
      case 'EDA Tools': return 'bg-violet-100 text-violet-700';
      case 'Manufacturing': return 'bg-blue-100 text-blue-700';
      case 'Equipment': return 'bg-cyan-100 text-cyan-700';
      case 'Materials': return 'bg-green-100 text-green-700';
      case 'Packaging/Testing': return 'bg-amber-100 text-amber-700';
      case 'End Products': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg
                         text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Sector filter */}
          <select
            value={sector}
            onChange={(e) => { setSector(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Supply Chain Stages</option>
            {stages.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing {companies.length} of {total} companies
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Company Grid */}
      {!loading && !error && (
        <>
          {companies.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-200 text-center">
              <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-800">No companies found</h3>
              <p className="text-slate-500 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map((company) => (
                <Link
                  key={company.id}
                  to={`/companies/${company.id}`}
                  className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-primary-200 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                        <Building2 size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 group-hover:text-primary-600 transition-colors">
                          {company.name}
                        </h3>
                        {company.headquarters && (
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin size={12} /> {company.headquarters}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {company.supply_chain_stage && (
                    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full mb-3 ${getStageColor(company.supply_chain_stage)}`}>
                      {company.supply_chain_stage}
                    </span>
                  )}

                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-600">{formatCurrency(company.revenue)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {company.employees ? company.employees.toLocaleString() : '-'}
                      </span>
                    </div>
                  </div>

                  {company.sector && (
                    <p className="text-xs text-slate-400 mt-2">{company.sector}</p>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-slate-600 px-4">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
