export interface Company {
  id: number;
  name: string;
  sector: string | null;
  sub_sector: string | null;
  headquarters: string | null;
  founded_year: number | null;
  revenue: number | null;
  employees: number | null;
  market_cap: number | null;
  description: string | null;
  supply_chain_stage: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Product {
  id: number;
  company_id: number;
  name: string;
  category: string | null;
  sub_category: string | null;
  description: string | null;
  technology_node: string | null;
  created_at: string | null;
}

export interface Relationship {
  id: number;
  source_id: number;
  target_id: number;
  relationship_type: string;
  strength: number | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string | null;
  source_name?: string;
  target_name?: string;
}

export interface GraphNode {
  id: number;
  name: string;
  sector: string | null;
  sub_sector: string | null;
  supply_chain_stage: string | null;
  revenue: number | null;
  employees: number | null;
  type: 'company';
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphEdge {
  id: number;
  source: number | GraphNode;
  target: number | GraphNode;
  relationship_type: string;
  strength: number | null;
  description: string | null;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface SupplyChainStage {
  stage: string;
  company_count: number;
  total_revenue: number;
  total_employees: number;
  companies: Company[];
}

export interface MarketShare {
  stage: string;
  total_revenue: number;
  total_market_cap: number;
  company_count: number;
}

export interface SectorRevenue {
  sector: string;
  total_revenue: number;
  avg_revenue: number;
  company_count: number;
}

export interface RelationshipDistribution {
  type: string;
  count: number;
}

export interface TrendData {
  revenue_by_sector: SectorRevenue[];
  relationship_distribution: RelationshipDistribution[];
}

export interface Summary {
  total_companies: number;
  total_products: number;
  total_relationships: number;
  total_revenue: number;
  total_employees: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
