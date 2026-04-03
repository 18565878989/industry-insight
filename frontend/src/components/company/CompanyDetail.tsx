import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companiesApi } from '../../services/api';
import type { Company, Product } from '../../types';
import { 
  Building2, MapPin, Users, DollarSign, TrendingUp,
  Package, ArrowLeft, ChevronRight
} from 'lucide-react';

export function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      
      try {
        const [companyData] = await Promise.all([
          companiesApi.getById(parseInt(id))
        ]);
        setCompany(companyData);
        
        try {
          const productsData = await companiesApi.getProducts(parseInt(id));
          setProducts(Array.isArray(productsData) ? productsData : []);
        } catch {
          setProducts([]);
        }
      } catch (err) {
        setError('Failed to load company details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 bg-[var(--bg-primary)]">
        <div className="w-10 h-10 border border-[var(--border-color)] border-t-[var(--text-primary)] rounded-full animate-spin" />
        <p className="text-[var(--text-secondary)] text-sm font-medium">Loading company details...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="max-w-2xl mx-auto mt-16 px-8">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6">
          <p className="text-[var(--text-primary)] font-medium">{error || 'Company not found'}</p>
        </div>
      </div>
    );
  }

  const formatRevenue = (revenue?: number | null) => {
    if (!revenue) return 'N/A';
    if (revenue >= 1e9) return `$${(revenue / 1e9).toFixed(1)}B`;
    if (revenue >= 1e6) return `$${(revenue / 1e6).toFixed(1)}M`;
    return `$${revenue.toLocaleString()}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-px">
      {/* Back Button */}
      <div className="bg-[var(--bg-primary)] px-8 py-6">
        <button
          onClick={() => navigate('/companies')}
          className="group flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <div className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] group-hover:border-[var(--border-color-hover)] transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span className="font-medium text-sm">Back to Companies</span>
        </button>
      </div>

      {/* Main Info Card */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] overflow-hidden">
        {/* Hero Header */}
        <div className="bg-[var(--bg-primary)] px-8 py-16 border-b border-[var(--border-color)]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[var(--bg-hover)] rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-[var(--text-secondary)]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[var(--text-primary)]">{company.name}</h1>
                {company.headquarters && (
                  <p className="text-[var(--text-secondary)] flex items-center gap-2 mt-3 text-base">
                    <MapPin size={16} />
                    {company.headquarters}
                  </p>
                )}
              </div>
            </div>
            <span className="px-4 py-2 bg-[var(--bg-hover)] text-[var(--text-secondary)] font-semibold text-sm border border-[var(--border-color)]">
              {company.sector || company.supply_chain_stage || 'Semiconductor'}
            </span>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {company.revenue && (
              <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-6 py-6">
                <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-2">
                  <DollarSign size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wide">Revenue</span>
                </div>
                <p className="text-xl font-bold text-[var(--text-primary)]">{formatRevenue(company.revenue)}</p>
              </div>
            )}
            {company.employees && (
              <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-6 py-6">
                <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-2">
                  <Users size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wide">Employees</span>
                </div>
                <p className="text-xl font-bold text-[var(--text-primary)]">{company.employees.toLocaleString()}</p>
              </div>
            )}
            {company.market_cap && (
              <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-6 py-6">
                <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-2">
                  <TrendingUp size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wide">Market Cap</span>
                </div>
                <p className="text-xl font-bold text-[var(--text-primary)]">{formatRevenue(company.market_cap)}</p>
              </div>
            )}
            {company.founded_year && (
              <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-6 py-6">
                <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-2">
                  <Building2 size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wide">Founded</span>
                </div>
                <p className="text-xl font-bold text-[var(--text-primary)]">{company.founded_year}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-px bg-[var(--border-color)]">
        {/* Company Info */}
        <div className="bg-[var(--bg-secondary)] px-6 py-8">
          <h2 className="font-bold text-[var(--text-primary)] text-lg mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--bg-hover)] rounded flex items-center justify-center">
              <Building2 size={16} className="text-[var(--text-secondary)]" />
            </div>
            Company Information
          </h2>
          
          <div className="space-y-4">
            {company.description && (
              <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-5 py-5">
                <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-2 block">Description</label>
                <p className="text-[var(--text-secondary)] leading-relaxed text-sm">{company.description}</p>
              </div>
            )}
            
            {company.sector && (
              <div className="flex items-center gap-4 p-5 bg-[var(--bg-primary)] border border-[var(--border-color)]">
                <div className="w-8 h-8 bg-[var(--bg-hover)] rounded flex items-center justify-center">
                  <TrendingUp size={16} className="text-[var(--text-secondary)]" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Sector</span>
                  <p className="text-[var(--text-primary)] font-semibold mt-1">{company.sector}</p>
                </div>
              </div>
            )}
            
            {company.sub_sector && (
              <div className="flex items-center gap-4 p-5 bg-[var(--bg-primary)] border border-[var(--border-color)]">
                <div className="w-8 h-8 bg-[var(--bg-hover)] rounded flex items-center justify-center">
                  <Package size={16} className="text-[var(--text-secondary)]" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Sub-Sector</span>
                  <p className="text-[var(--text-primary)] font-semibold mt-1">{company.sub_sector}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products */}
        <div className="bg-[var(--bg-secondary)] px-6 py-8">
          <h2 className="font-bold text-[var(--text-primary)] text-lg mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--bg-hover)] rounded flex items-center justify-center">
              <Package size={16} className="text-[var(--text-secondary)]" />
            </div>
            Products ({products.length})
          </h2>
          
          {products.length === 0 ? (
            <div className="text-center py-10 bg-[var(--bg-primary)] border border-[var(--border-color)]">
              <div className="w-12 h-12 bg-[var(--bg-hover)] rounded-lg flex items-center justify-center mx-auto mb-3">
                <Package size={24} className="text-[var(--text-faint)]" />
              </div>
              <p className="text-[var(--text-secondary)] font-medium text-sm">No product information available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-5 py-5 hover:border-[var(--border-color-hover)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">{product.name}</p>
                      {product.category && (
                        <span className="inline-block text-xs px-2 py-1 bg-[var(--bg-hover)] text-[var(--text-secondary)] font-medium mt-2">
                          {product.category}
                        </span>
                      )}
                    </div>
                    {product.technology_node && (
                      <span className="text-xs px-2 py-1 bg-[var(--bg-hover)] text-[var(--text-secondary)] font-semibold">
                        {product.technology_node}
                      </span>
                    )}
                  </div>
                  {product.description && (
                    <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">{product.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Supply Chain Stage */}
      {company.supply_chain_stage && (
        <div className="bg-[var(--bg-secondary)] px-8 py-8 border-t border-[var(--border-color)]">
          <h2 className="font-bold text-[var(--text-primary)] text-lg mb-5">Supply Chain Position</h2>
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <div className="w-3 h-3 bg-[var(--text-secondary)] rounded-full" />
            <span className="font-bold text-base text-[var(--text-primary)]">{company.supply_chain_stage}</span>
            <ChevronRight size={18} className="text-[var(--text-faint)]" />
          </div>
        </div>
      )}
    </div>
  );
}
