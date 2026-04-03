import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => localStorage.getItem('theme') as 'dark' | 'light' || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <BrowserRouter>
      <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <Sidebar theme={theme} onToggleTheme={toggleTheme} />
        <main className="flex-1 flex flex-col min-w-0">
          {/* Main Content Area */}
          <div className="flex-1 overflow-auto">
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
          <footer className="border-t py-4 px-8" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span>© 2024 Industry Insight Platform. Semiconductor Supply Chain Intelligence.</span>
              <span>Powered by WANGFENG</span>
            </div>
          </footer>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
