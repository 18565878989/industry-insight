import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  Handshake,
  Target,
  ExternalLink,
} from 'lucide-react';
import { companiesApi } from '../../services/api';
import type { Company, Product, Relationship } from '../../types';

export function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [competitors, setCompetitors] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'relationships' | 'competitors'>('products');

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const companyId = parseInt(id, 10);
        const [companyData, productsData, relationshipsData, competitorsData] = await Promise.all([
          companiesApi.getById(companyId),
          companiesApi.getProducts(companyId),
          companiesApi.getRelationships(companyId),
          companiesApi.getCompetitors(companyId),
        ]);
        setCompany(companyData);
        setProducts(productsData);
        setRelationships(relationshipsData);
        setCompetitors(competitorsData);
      } catch (err) {
        setError('Failed to load company details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const formatCurrency = (value: number | null) => {
    if (!value) return '-';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toFixed(0)}`;
  };

  const getRelationshipColor = (type: string) => {
    switch (type) {
      case 'SUPPLIES': return 'bg-blue-100 text-blue-700';
      case 'COMPETES': return 'bg-red-100 text-red-700';
      case 'PARTNERS': return 'bg-green-100 text-green-700';
      case 'INVESTS': return 'bg-purple-100 text-purple-700';
      case 'ACQUIRES': return 'bg-orange-100 text-orange-700';
      case 'USES': return 'bg-cyan-100 text-cyan-700';
      default: return 'bg-slate-100 text-slate-700';
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
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

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/companies"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Companies</span>
      </Link>

      {/* Company Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 size={40} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{company.name}</h2>
                {company.headquarters && (
                  <p className="text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin size={16} /> {company.headquarters}
                  </p>
                )}
              </div>
              {company.supply_chain_stage && (
                <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${getStageColor(company.supply_chain_stage)}`}>
                  {company.supply_chain_stage}
                </span>
              )}
            </div>

            {company.description && (
              <p className="text-slate-600 mt-3">{company.description}</p>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <DollarSign size={14} /> Revenue
                </div>
                <p className="text-xl font-semibold text-slate-800">{formatCurrency(company.revenue)}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <TrendingUp size={14} /> Market Cap
                </div>
                <p className="text-xl font-semibold text-slate-800">{formatCurrency(company.market_cap)}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <Users size={14} /> Employees
                </div>
                <p className="text-xl font-semibold text-slate-800">
                  {company.employees ? company.employees.toLocaleString() : '-'}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <Calendar size={14} /> Founded
                </div>
                <p className="text-xl font-semibold text-slate-800">
                  {company.founded_year || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6">
          {(['products', 'relationships', 'competitors'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab} {tab === 'products' && `(${products.length})`}
              {tab === 'relationships' && `(${relationships.length})`}
              {tab === 'competitors' && `(${competitors.length})`}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'products' && (
          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="bg-slate-50 rounded-lg p-8 text-center">
                <Package size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-800">{product.name}</h4>
                        <p className="text-sm text-slate-500">{product.category}</p>
                      </div>
                      {product.technology_node && (
                        <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded">
                          {product.technology_node}
                        </span>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-sm text-slate-600 mt-2">{product.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'relationships' && (
          <div className="space-y-4">
            {relationships.length === 0 ? (
              <div className="bg-slate-50 rounded-lg p-8 text-center">
                <Handshake size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500">No relationships found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {relationships.map((rel) => (
                  <div key={rel.id} className="bg-white rounded-lg p-4 border border-slate-200 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getRelationshipColor(rel.relationship_type)}`}>
                          {rel.relationship_type}
                        </span>
                        <span className="text-slate-400">|</span>
                        <span className="text-sm text-slate-600">
                          {rel.source_id === company.id ? rel.target_name : rel.source_name}
                        </span>
                      </div>
                      {rel.description && (
                        <p className="text-sm text-slate-500">{rel.description}</p>
                      )}
                    </div>
                    {rel.strength && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-400">Strength:</span>
                        <span className="text-sm font-medium text-slate-700">{rel.strength}/10</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'competitors' && (
          <div className="space-y-4">
            {competitors.length === 0 ? (
              <div className="bg-slate-50 rounded-lg p-8 text-center">
                <Target size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500">No competitors found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {competitors.map((comp) => (
                  <Link
                    key={comp.id}
                    to={`/companies/${comp.id}`}
                    className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md hover:border-primary-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-700 rounded-lg flex items-center justify-center">
                        <Building2 size={18} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 group-hover:text-primary-600 transition-colors">
                          {comp.name}
                        </h4>
                        <p className="text-xs text-slate-500">{comp.headquarters || comp.sector}</p>
                      </div>
                      <ExternalLink size={16} className="text-slate-300 group-hover:text-primary-500" />
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-sm text-slate-600">{formatCurrency(comp.revenue)}</span>
                      <span className="text-xs text-slate-400">{comp.employees?.toLocaleString() || '-'} employees</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
