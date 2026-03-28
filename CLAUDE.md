# Industry Chain Insight Report System - Specification

## Project Overview

**Project Name:** Industry Chain Insight Report System
**Project Type:** Full-stack Web Application
**Core Functionality:** A knowledge graph-based system for analyzing industry chains with focus on semiconductor supply chain, providing company profiles, supply chain visualization, competitive intelligence, and trend analysis.
**Target Users:** Business analysts, investors, researchers, and industry professionals

---

## Architecture Overview

### Tech Stack
- **Frontend:** React 18 + TypeScript + Tailwind CSS + Vite
- **Backend:** Python/Flask REST API
- **Visualization:** D3.js for knowledge graph and network visualization
- **Database:** SQLite with SQLAlchemy ORM

### Project Structure
```
industry-insight/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── models.py          # SQLAlchemy models
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── companies.py
│   │   │   ├── products.py
│   │   │   ├── relationships.py
│   │   │   └── analysis.py
│   │   └── seed_data.py       # Semiconductor industry data
│   ├── config.py
│   ├── run.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Header.tsx
│   │   │   ├── knowledge-graph/
│   │   │   │   └── KnowledgeGraph.tsx
│   │   │   ├── company/
│   │   │   │   ├── CompanyList.tsx
│   │   │   │   └── CompanyDetail.tsx
│   │   │   ├── supply-chain/
│   │   │   │   └── SupplyChainView.tsx
│   │   │   └── analysis/
│   │   │       └── TrendAnalysis.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── CLAUDE.md
└── SPEC.md
```

---

## Functionality Specification

### 1. Knowledge Graph Foundation

#### Ontology System
- **Entity Types:**
  - `Company` - Business entities with financial data
  - `Product` - Products and services offered
  - `Technology` - Core technologies and IP
  - `Material` - Raw materials and components

- **Relationship Types:**
  - `SUPPLIES` - Supplier relationship (A supplies B)
  - `COMPETES` - Competitive relationship (A competes with B)
  - `INVESTS` - Investment relationship (A invests in B)
  - `PARTNERS` - Partnership/collaboration (A partners with B)
  - `ACQUIRES` - Acquisition (A acquires B)
  - `USES` - Technology/material usage (A uses B's tech)

#### Knowledge Graph Visualization
- Interactive force-directed graph using D3.js
- Node sizes based on company revenue/market presence
- Edge thickness based on relationship strength
- Color coding by entity type and sector
- Zoom, pan, and drag interactions
- Click node to view details
- Filter by relationship type and entity type

### 2. Semiconductor Industry Focus

#### Supply Chain Stages
1. **EDA Tools** - Electronic Design Automation (Cadence, Synopsys)
2. **Design** - Fabless design companies (NVIDIA, AMD, Qualcomm)
3. **Manufacturing** - Wafer fab (TSMC, Samsung, Intel)
4. **Equipment** - Manufacturing equipment (ASML, Applied Materials)
5. **Materials** - Silicon, chemicals, gases (Shin-Etsu, Air Products)
6. **Packaging/Testing** - OSAT (ASE Technology, Amkor)
7. **End Products** - Electronics (Apple, Dell, etc.)

#### Major Companies Database
- NVIDIA, AMD, Qualcomm (Design)
- TSMC, Samsung, Intel (Manufacturing)
- ASML, Applied Materials, Lam Research (Equipment)
- Shin-Etsu, Air Products, Linde (Materials)
- ASE Technology, Amkor (Packaging/Testing)

### 3. Core Features

#### Company Profiles
- Company overview (name, sector, headquarters, founded)
- Financial metrics (revenue, employees, market cap)
- Product portfolio with categories
- Strategic positioning in supply chain
- Key competitors and partners

#### Supply Chain Visualization
- Hierarchical view of supply chain stages
- Flow visualization with animated connections
- Bottleneck identification
- Dependency analysis

#### Industry Chain Mapping
- Multi-level drill-down view
- Geographic distribution
- Market share visualization
- Technology node mapping

#### Trend Analysis
- Revenue trends by segment
- Market share changes over time
- Investment flow analysis
- Technology evolution tracking

#### Competitive Intelligence
- Direct competitor identification
- Market positioning matrix
- SWOT-style analysis
- Strategic move tracking

### 4. Data Structure

#### Companies Table
```sql
CREATE TABLE companies (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    sub_sector VARCHAR(100),
    headquarters VARCHAR(255),
    founded_year INTEGER,
    revenue DECIMAL(15, 2),
    employees INTEGER,
    market_cap DECIMAL(15, 2),
    description TEXT,
    supply_chain_stage VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Products Table
```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    sub_category VARCHAR(100),
    description TEXT,
    technology_node VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Relationships Table
```sql
CREATE TABLE relationships (
    id INTEGER PRIMARY KEY,
    source_id INTEGER REFERENCES companies(id),
    target_id INTEGER REFERENCES companies(id),
    relationship_type VARCHAR(50) NOT NULL,
    strength INTEGER CHECK(strength >= 1 AND strength <= 10),
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### Companies
- `GET /api/companies` - List all companies (with pagination, filtering)
- `GET /api/companies/:id` - Get company details
- `GET /api/companies/:id/products` - Get company's products
- `GET /api/companies/:id/relationships` - Get company's relationships
- `GET /api/companies/:id/competitors` - Get direct competitors

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/category/:category` - Get products by category

### Relationships
- `GET /api/relationships` - List all relationships
- `GET /api/relationships/types` - Get all relationship types
- `GET /api/relationships/graph` - Get graph data for visualization

### Analysis
- `GET /api/analysis/supply-chain` - Get supply chain overview
- `GET /api/analysis/market-share` - Get market share data
- `GET /api/analysis/trends` - Get trend data

---

## Frontend Components

### Layout Components
- **Sidebar** - Navigation menu with sections
- **Header** - Search bar, filters, user actions

### Knowledge Graph
- Force-directed graph with D3.js
- Interactive node/edge visualization
- Legend for node/edge types
- Filter controls

### Company Components
- **CompanyList** - Searchable/filterable company grid
- **CompanyCard** - Compact company summary
- **CompanyDetail** - Full company profile view

### Supply Chain
- **SupplyChainView** - Hierarchical supply chain diagram
- **StageCard** - Individual supply chain stage info

### Analysis
- **TrendAnalysis** - Charts for trend visualization
- **MarketShareChart** - Market share pie/bar charts

---

## User Interactions and Flows

### Main Navigation Flow
1. Dashboard → Overview of semiconductor industry
2. Knowledge Graph → Interactive company relationships
3. Companies → Browse and search companies
4. Supply Chain → View supply chain hierarchy
5. Analysis → Trend and market analysis

### Company Investigation Flow
1. User clicks company in graph or list
2. Slide-in panel shows company details
3. User can explore products, relationships, competitors
4. Click through to related companies

### Graph Exploration Flow
1. Pan/zoom to explore graph
2. Click node to select and highlight connections
3. Use filters to show specific relationship types
4. Double-click to expand related nodes

---

## Edge Cases

- Empty search results - Show helpful message with suggestions
- Graph with many nodes - Implement clustering and level-of-detail
- Single company with no relationships - Show placeholder
- API errors - Graceful error handling with retry option
- Large datasets - Pagination and lazy loading

---

## Acceptance Criteria

### Must Have
- [ ] SQLite database with seeded semiconductor industry data
- [ ] Flask API with all specified endpoints working
- [ ] React frontend with all navigation sections
- [ ] Knowledge graph visualization with D3.js
- [ ] Company profiles with products and relationships
- [ ] Supply chain hierarchical view
- [ ] Basic trend analysis charts

### Visual Checkpoints
- [ ] Sidebar navigation with icons and labels
- [ ] Knowledge graph renders with colored nodes by sector
- [ ] Company cards show key metrics (revenue, employees)
- [ ] Supply chain diagram shows flow from Design to End Products
- [ ] Interactive filters on graph and lists

### Performance
- [ ] Initial page load < 3 seconds
- [ ] Graph renders smoothly with 50+ nodes
- [ ] API responses < 500ms for simple queries

---

## Development Phases

### Phase 1: Backend Foundation
1. Set up Flask project structure
2. Create SQLAlchemy models
3. Implement seed data for semiconductor industry
4. Build all API endpoints
5. Verify with API testing

### Phase 2: Frontend Foundation
1. Set up React + Vite + TypeScript + Tailwind
2. Create layout components (Sidebar, Header)
3. Build API service layer
4. Set up routing

### Phase 3: Core Features
1. Implement Knowledge Graph visualization
2. Build Company List and Detail views
3. Create Supply Chain visualization
4. Add Analysis charts

### Phase 4: Polish
1. Add loading states and error handling
2. Implement search and filtering
3. Responsive design adjustments
4. Final testing and verification
