import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { CompanyList } from './components/company/CompanyList';
import { CompanyDetail } from './components/company/CompanyDetail';
import { KnowledgeGraph } from './components/knowledge-graph/KnowledgeGraph';
import { SupplyChainView } from './components/supply-chain/SupplyChainView';
import { TrendAnalysis } from './components/analysis/TrendAnalysis';
import { Settings } from './components/settings/Settings';
import { ChatAssistant } from './components/chat/ChatAssistant';
import { News } from './pages/News';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation Bar */}
          <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 border-b border-black/5">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 p-6 lg:p-8 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/companies" element={<CompanyList />} />
              <Route path="/companies/:id" element={<CompanyDetail />} />
              <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
              <Route path="/supply-chain" element={<SupplyChainView />} />
              <Route path="/analysis" element={<TrendAnalysis />} />
              <Route path="/news" element={<News />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/assistant" element={<ChatAssistant />} />
            </Routes>
          </div>
          
          {/* Footer */}
          <footer className="border-t border-black/5 bg-white/50 backdrop-blur-sm py-4 px-6 lg:px-8">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>© 2024 Industry Insight Platform. Semiconductor Supply Chain Intelligence.</span>
              <span>Powered by SemiKong Ontology</span>
            </div>
          </footer>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
