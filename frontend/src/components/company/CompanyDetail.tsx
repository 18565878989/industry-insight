import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companiesApi } from '../../services/api';
import type { Company, Product } from '../../types';
import { 
  Building2, MapPin, Users, DollarSign, TrendingUp,
  Package, ArrowLeft, Sparkles, ChevronRight
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
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-violet-600 animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-gray-600 font-semibold text-lg">Loading company details...</p>
          <p className="text-gray-400 text-sm mt-1">Fetching latest data</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="apple-alert apple-alert-error max-w-2xl mx-auto mt-8">
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Error</h3>
          <p className="text-sm opacity-80">{error || 'Company not found'}</p>
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

  const getStageGradient = (stage: string | null) => {
    switch (stage) {
      case 'Design': return 'from-purple-500 via-violet-600 to-indigo-600';
      case 'EDA Tools': return 'from-violet-500 via-fuchsia-600 to-purple-600';
      case 'Manufacturing': return 'from-blue-500 via-cyan-600 to-teal-600';
      case 'Equipment': return 'from-cyan-500 via-teal-600 to-emerald-600';
      case 'Materials': return 'from-green-500 via-emerald-600 to-teal-600';
      case 'Packaging/Testing': return 'from-amber-500 via-orange-600 to-yellow-600';
      case 'End Products': return 'from-red-500 via-rose-600 to-pink-600';
      default: return 'from-gray-500 via-gray-600 to-gray-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      {/* Back Button - Apple Style */}
      <button
        onClick={() => navigate('/companies')}
        className="group flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-colors"
      >
        <div className="p-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-black/5 group-hover:bg-white group-hover:shadow-xl transition-all">
          <ArrowLeft size={20} />
        </div>
        <span className="font-semibold text-sm">Back to Companies</span>
      </button>

      {/* Main Info Card - Apple Hero Style */}
      <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-black/10 border border-black/5 overflow-hidden">
        {/* Hero Header */}
        <div className={`bg-gradient-to-br ${getStageGradient(company.supply_chain_stage)} p-10 relative overflow-hidden`}>
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
          </div>
          
          {/* Glow */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
          
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-xl border border-white/20">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">{company.name}</h1>
                {company.headquarters && (
                  <p className="text-white/80 flex items-center gap-2 mt-2 text-lg">
                    <MapPin size={16} />
                    {company.headquarters}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className="px-5 py-2.5 bg-white/20 backdrop-blur-xl rounded-2xl text-white font-bold text-sm border border-white/20">
                {company.sector || company.supply_chain_stage || 'Semiconductor'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Quick Stats - Apple Cards */}
        <div className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {company.revenue && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-center gap-2.5 text-green-600 mb-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <DollarSign size={16} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide">Revenue</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatRevenue(company.revenue)}</p>
              </div>
            )}
            {company.employees && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-center gap-2.5 text-blue-600 mb-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Users size={16} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide">Employees</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{company.employees.toLocaleString()}</p>
              </div>
            )}
            {company.market_cap && (
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-5 border border-purple-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-center gap-2.5 text-purple-600 mb-3">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <TrendingUp size={16} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide">Market Cap</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatRevenue(company.market_cap)}</p>
              </div>
            )}
            {company.founded_year && (
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-center gap-2.5 text-orange-600 mb-3">
                  <div className="p-2 bg-orange-100 rounded-xl">
                    <Building2 size={16} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide">Founded</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{company.founded_year}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Company Info - Apple Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-lg shadow-black/5 border border-black/5">
          <h2 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-3">
            <div className="p-2.5 bg-violet-100 rounded-xl">
              <Building2 size={20} className="text-violet-600" />
            </div>
            Company Information
          </h2>
          
          <div className="space-y-4">
            {company.description && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">Description</label>
                <p className="text-gray-700 leading-relaxed">{company.description}</p>
              </div>
            )}
            
            {company.sector && (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-100">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <TrendingUp size={18} className="text-blue-600" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Sector</span>
                  <p className="text-gray-900 font-bold">{company.sector}</p>
                </div>
              </div>
            )}
            
            {company.sub_sector && (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-100">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Package size={18} className="text-purple-600" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Sub-Sector</span>
                  <p className="text-gray-900 font-bold">{company.sub_sector}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products - Apple Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-lg shadow-black/5 border border-black/5">
          <h2 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-3">
            <div className="p-2.5 bg-green-100 rounded-xl">
              <Package size={20} className="text-green-600" />
            </div>
            Products ({products.length})
          </h2>
          
          {products.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No product information available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{product.name}</p>
                      {product.category && (
                        <span className="inline-block text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-xl font-bold mt-2">
                          {product.category}
                        </span>
                      )}
                    </div>
                    {product.technology_node && (
                      <span className="text-xs px-3 py-1.5 bg-violet-100 text-violet-700 rounded-xl font-bold">
                        {product.technology_node}
                      </span>
                    )}
                  </div>
                  {product.description && (
                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">{product.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Supply Chain Stage */}
      {company.supply_chain_stage && (
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-lg shadow-black/5 border border-black/5">
          <h2 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-violet-500" />
            Supply Chain Position
          </h2>
          <div className={`inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r ${getStageGradient(company.supply_chain_stage)} rounded-2xl text-white shadow-xl`}>
            <div className="w-4 h-4 bg-white/30 rounded-full" />
            <span className="font-bold text-xl">{company.supply_chain_stage}</span>
            <ChevronRight size={20} className="text-white/60" />
          </div>
        </div>
      )}
    </div>
  );
}
