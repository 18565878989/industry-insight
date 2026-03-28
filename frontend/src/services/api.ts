import axios from 'axios';
import type {
  Company,
  Product,
  Relationship,
  GraphData,
  SupplyChainStage,
  MarketShare,
  TrendData,
  Summary,
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Companies API
export const companiesApi = {
  getAll: async (params?: {
    page?: number;
    per_page?: number;
    sector?: string;
    supply_chain_stage?: string;
    search?: string;
  }) => {
    const response = await api.get<{
      companies: Company[];
      total: number;
      page: number;
      per_page: number;
      pages: number;
    }>('/companies', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Company>(`/companies/${id}`);
    return response.data;
  },

  getProducts: async (id: number) => {
    const response = await api.get<{ products: Product[] }>(`/companies/${id}/products`);
    return response.data.products;
  },

  getRelationships: async (id: number, type?: string) => {
    const response = await api.get<{ relationships: Relationship[] }>(
      `/companies/${id}/relationships`,
      { params: { type } }
    );
    return response.data.relationships;
  },

  getCompetitors: async (id: number) => {
    const response = await api.get<{ competitors: Company[] }>(`/companies/${id}/competitors`);
    return response.data.competitors;
  },

  getSectors: async () => {
    const response = await api.get<{ sectors: string[] }>('/companies/sectors');
    return response.data.sectors;
  },

  getSupplyChainStages: async () => {
    const response = await api.get<{ stages: string[] }>('/companies/supply-chain-stages');
    return response.data.stages;
  },
};

// Products API
export const productsApi = {
  getAll: async (params?: { page?: number; per_page?: number; category?: string; company_id?: number }) => {
    const response = await api.get<{
      products: Product[];
      total: number;
      page: number;
      per_page: number;
      pages: number;
    }>('/products', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  getByCategory: async (category: string) => {
    const response = await api.get<{ products: Product[]; category: string }>(
      `/products/category/${category}`
    );
    return response.data.products;
  },

  getCategories: async () => {
    const response = await api.get<{ categories: string[] }>('/products/categories');
    return response.data.categories;
  },
};

// Relationships API
export const relationshipsApi = {
  getAll: async (type?: string) => {
    const response = await api.get<{ relationships: Relationship[] }>('/relationships', {
      params: { type },
    });
    return response.data.relationships;
  },

  getTypes: async () => {
    const response = await api.get<{ types: string[] }>('/relationships/types');
    return response.data.types;
  },

  getGraphData: async () => {
    const response = await api.get<GraphData>('/relationships/graph');
    return response.data;
  },
};

// Analysis API
export const analysisApi = {
  getSupplyChain: async () => {
    const response = await api.get<{ supply_chain: SupplyChainStage[] }>('/analysis/supply-chain');
    return response.data.supply_chain;
  },

  getMarketShare: async () => {
    const response = await api.get<{ market_share: MarketShare[] }>('/analysis/market-share');
    return response.data.market_share;
  },

  getTrends: async () => {
    const response = await api.get<TrendData>('/analysis/trends');
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get<{ summary: Summary }>('/analysis/summary');
    return response.data.summary;
  },
};

// Health check
export const healthApi = {
  check: async () => {
    const response = await api.get<{ status: string; service: string }>('/health');
    return response.data;
  },
};

export default api;
