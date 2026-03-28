import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { CompanyList } from './components/company/CompanyList';
import { CompanyDetail } from './components/company/CompanyDetail';
import { KnowledgeGraph } from './components/knowledge-graph/KnowledgeGraph';
import { SupplyChainView } from './components/supply-chain/SupplyChainView';
import { TrendAnalysis } from './components/analysis/TrendAnalysis';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <Routes>
            <Route path="/" element={<Header title="Dashboard" subtitle="Semiconductor Industry Overview" />} />
            <Route path="/companies" element={<Header title="Companies" subtitle="Browse industry players" />} />
            <Route path="/companies/:id" element={<Header title="Company Details" />} />
            <Route path="/knowledge-graph" element={<Header title="Knowledge Graph" subtitle="Interactive relationship visualization" />} />
            <Route path="/supply-chain" element={<Header title="Supply Chain" subtitle="Industry value chain analysis" />} />
            <Route path="/analysis" element={<Header title="Analysis" subtitle="Trends and market insights" />} />
          </Routes>
          <div className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/companies" element={<CompanyList />} />
              <Route path="/companies/:id" element={<CompanyDetail />} />
              <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
              <Route path="/supply-chain" element={<SupplyChainView />} />
              <Route path="/analysis" element={<TrendAnalysis />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
