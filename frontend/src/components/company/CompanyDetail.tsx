import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companiesApi } from '../../services/api';
import type { Company, Product } from '../../types';
import { 
  Building2, MapPin, Users, DollarSign, TrendingUp,
  Package, ArrowLeft, Loader2
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
        
        // Fetch products separately to avoid type issues
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error || 'Company not found'}
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/companies')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Companies</span>
      </button>

      {/* Main Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{company.name}</h1>
            </div>
            <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full">
              {company.sector || company.supply_chain_stage || 'Semiconductor'}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {company.revenue && (
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <DollarSign size={16} />
                  <span className="text-xs font-medium">Revenue</span>
                </div>
                <p className="text-xl font-bold text-slate-800">{formatRevenue(company.revenue)}</p>
              </div>
            )}
            {company.employees && (
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Users size={16} />
                  <span className="text-xs font-medium">Employees</span>
                </div>
                <p className="text-xl font-bold text-slate-800">{company.employees.toLocaleString()}</p>
              </div>
            )}
            {company.market_cap && (
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <TrendingUp size={16} />
                  <span className="text-xs font-medium">Market Cap</span>
                </div>
                <p className="text-xl font-bold text-slate-800">{formatRevenue(company.market_cap)}</p>
              </div>
            )}
            {company.founded_year && (
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Building2 size={16} />
                  <span className="text-xs font-medium">Founded</span>
                </div>
                <p className="text-xl font-bold text-slate-800">{company.founded_year}</p>
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Company Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Building2 size={20} />
                Company Information
              </h2>
              
              <div className="space-y-3">
                {company.description && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Description</label>
                    <p className="text-slate-700 mt-1">{company.description}</p>
                  </div>
                )}
                
                {company.headquarters && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-slate-400" />
                    <span className="text-slate-700">{company.headquarters}</span>
                  </div>
                )}
                
                {company.sector && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Sector</label>
                    <p className="text-slate-700">{company.sector}</p>
                  </div>
                )}
                
                {company.sub_sector && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Sub-Sector</label>
                    <p className="text-slate-700">{company.sub_sector}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Products */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Package size={20} />
                Products ({products.length})
              </h2>
              
              {products.length === 0 ? (
                <p className="text-slate-500 text-sm">No product information available</p>
              ) : (
                <div className="space-y-2">
                  {products.map((product) => (
                    <div key={product.id} className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-800">{product.name}</p>
                          {product.category && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full mt-1 inline-block">
                              {product.category}
                            </span>
                          )}
                        </div>
                        {product.technology_node && (
                          <span className="text-xs text-slate-500">
                            {product.technology_node}
                          </span>
                        )}
                      </div>
                      {product.description && (
                        <p className="text-sm text-slate-600 mt-1">{product.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Supply Chain Stage */}
          {company.supply_chain_stage && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Supply Chain Position</h2>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                  {company.supply_chain_stage}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
