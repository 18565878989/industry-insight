import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Network,
  GitBranch,
  TrendingUp,
  Settings,
  MessageCircle,
  Menu,
  X,
  Newspaper,
  Cpu,
  Sun,
  Moon,
  Brain,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/companies', icon: Building2, label: 'Companies' },
  { to: '/knowledge-graph', icon: Network, label: 'Knowledge Graph' },
  { to: '/ontology', icon: Brain, label: 'Ontology' },
  { to: '/supply-chain', icon: GitBranch, label: 'Supply Chain' },
  { to: '/analysis', icon: TrendingUp, label: 'Analysis' },
  { to: '/news', icon: Newspaper, label: 'Industry News' },
  { to: '/assistant', icon: MessageCircle, label: 'AI Assistant' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function Sidebar({ theme, onToggleTheme }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const isLight = theme === 'light';

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-5 left-5 z-50 p-2 border"
        style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X size={18} />
        ) : (
          <Menu size={18} />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 backdrop-blur-sm"
          style={{ backgroundColor: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)' }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-40
          transition-all duration-300 ease-out
          ${isCollapsed ? 'w-16' : 'w-60'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div 
          className="h-full flex flex-col border-r"
          style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
        >
          {/* Logo */}
          <div className="h-16 px-4 flex items-center border-b" style={{ borderColor: 'var(--border-color)' }}>
            {!isCollapsed ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                  <Cpu size={14} className="text-white" />
                </div>
                <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>Industry Insight</span>
              </div>
            ) : (
              <div className="mx-auto">
                <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                  <Cpu size={14} className="text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <div className="px-3 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <button
              onClick={onToggleTheme}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200"
              style={{ 
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
              aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
            >
              {isLight ? (
                <Moon size={16} className="flex-shrink-0" />
              ) : (
                <Sun size={16} className="flex-shrink-0" />
              )}
              {!isCollapsed && (
                <span className="font-medium text-xs tracking-wide">
                  {isLight ? 'Dark Mode' : 'Light Mode'}
                </span>
              )}
            </button>
          </div>

          {/* Collapse Toggle - Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-36 w-6 h-6 rounded-full items-center justify-center transition-all duration-200"
            style={{ 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.borderColor = 'var(--border-color-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
            aria-label="Toggle sidebar"
          >
            <span className="text-xs">{isCollapsed ? '›' : '‹'}</span>
          </button>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <div className="space-y-0.5 px-2">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5
                    transition-all duration-200
                    ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}
                  `}
                  style={({ isActive }) => ({
                    background: isActive ? 'var(--nav-active-bg)' : 'transparent',
                    color: isActive ? 'var(--nav-active-text)' : 'var(--nav-inactive-text)',
                  })}
                  onMouseEnter={(e) => {
                    const isActive = (e.currentTarget as HTMLElement).getAttribute('aria-current') === 'page' || 
                      e.currentTarget.style.background.includes('var(--nav-active-bg)');
                    if (!isActive || e.currentTarget.style.background === 'transparent') {
                      e.currentTarget.style.background = 'var(--nav-hover-bg)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--nav-inactive-text)';
                    }
                  }}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium text-xs tracking-wide">{label}</span>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            {!isCollapsed ? (
              <div className="flex items-center gap-2">
                <div className="status-dot" />
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>System Online</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="status-dot" />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
