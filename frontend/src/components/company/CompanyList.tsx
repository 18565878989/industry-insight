import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Building2, MapPin, Users, DollarSign, X, Grid, List } from 'lucide-react';
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

  const clearFilters = () => {
    setSearch('');
    setSector('');
    setStage('');
    setPage(1);
  };

  const hasActiveFilters = search || sector || stage;

  return (
    <div className="space-y-px">
      {/* Hero Section */}
      <div className="bg-[var(--bg-primary)] px-8 py-16 border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full" />
            <span className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-medium">Industry Directory</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] tracking-tight leading-[1.1]">
            Companies
          </h1>
          <div className="flex items-center gap-6 mt-8">
            <div className="flex items-center gap-3">
              <Building2 size={16} className="text-[var(--text-secondary)]" />
              <span className="font-bold text-[var(--text-primary)]">{total}</span>
              <span className="text-[var(--text-secondary)] text-sm">companies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--bg-secondary)] px-8 py-5 border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--border-color-hover)] transition-colors placeholder:text-[var(--text-secondary)]"
            />
          </div>

          {/* Sector filter */}
          <select
            value={sector}
            onChange={(e) => { setSector(e.target.value); setPage(1); }}
            className="px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none cursor-pointer transition-colors min-w-[160px]"
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
            className="px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none cursor-pointer transition-colors min-w-[180px]"
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
              className="flex items-center gap-2 px-4 py-3 text-[var(--accent)] text-sm font-semibold hover:bg-[var(--accent-bg)] transition-colors border border-[var(--accent)]"
              style={{ backgroundColor: 'var(--accent-bg)', borderColor: 'var(--accent)' }}
            >
              <X size={16} />
              Clear
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-[var(--bg-primary)] p-1 border border-[var(--border-color)]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Results info */}
      <div className="bg-[var(--bg-primary)] px-8 py-4 border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">
            Showing <span className="font-bold text-[var(--text-primary)]">{companies.length}</span> of <span className="font-bold text-[var(--text-primary)]">{total}</span> companies
          </span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-64 gap-4 bg-[var(--bg-primary)]">
          <div className="w-8 h-8 border border-[var(--border-color)] border-t-[var(--text-primary)] rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)] text-sm font-medium">Loading companies...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-[var(--bg-primary)] px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6">
              <p className="text-[var(--text-primary)] font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Company Grid/List */}
      {!loading && !error && (
        <div className="bg-[var(--bg-primary)] px-8 py-10">
          <div className="max-w-6xl mx-auto">
            {companies.length === 0 ? (
              <div className="text-center py-20">
                <Building2 size={40} className="text-[var(--text-faint)] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">No companies found</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">Try adjusting your search or filters</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3' : 'space-y-3'}>
                {companies.map((company) => (
                  <Link
                    key={company.id}
                    to={`/companies/${company.id}`}
                    className={`
                      group bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 
                      hover:border-[var(--border-color-hover)] 
                      transition-colors
                      ${viewMode === 'list' ? 'flex items-center gap-5' : ''}
                    `}
                  >
                    <div className={viewMode === 'grid' ? 'mb-5' : 'flex-shrink-0'}>
                      <div className="w-12 h-12 bg-[var(--bg-hover)] rounded-lg flex items-center justify-center group-hover:bg-[var(--bg-hover)] transition-colors">
                        <Building2 size={22} className="text-[var(--text-secondary)]" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--text-secondary)] transition-colors line-clamp-1 text-base">
                        {company.name}
                      </h3>
                      {company.headquarters && (
                        <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5 mt-2">
                          <MapPin size={12} />
                          {company.headquarters}
                        </p>
                      )}

                      {company.supply_chain_stage && (
                        <span className="inline-block px-2.5 py-1 text-xs font-semibold mt-3 bg-[var(--bg-hover)] text-[var(--text-secondary)]">
                          {company.supply_chain_stage}
                        </span>
                      )}

                      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[var(--border-color)]">
                        <div className="flex items-center gap-2">
                          <DollarSign size={14} className="text-[var(--text-faint)]" />
                          <span className="text-sm font-semibold text-[var(--text-secondary)]">{formatCurrency(company.revenue)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-[var(--text-faint)]" />
                          <span className="text-sm font-semibold text-[var(--text-secondary)]">
                            {company.employees ? company.employees.toLocaleString() : '-'}
                          </span>
                        </div>
                      </div>

                      {company.sector && (
                        <p className="text-xs text-[var(--text-faint)] mt-3 truncate">{company.sector}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--border-color-hover)] transition-colors"
                >
                  <ChevronLeft size={20} className="text-[var(--text-secondary)]" />
                </button>
                
                <div className="flex items-center gap-1">
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
                          w-10 h-10 font-semibold text-sm transition-colors
                          ${page === pageNum
                            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[var(--border-color-hover)]'
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
                  className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--border-color-hover)] transition-colors"
                >
                  <ChevronRight size={20} className="text-[var(--text-secondary)]" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
