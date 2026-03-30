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
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', color: 'from-blue-500 to-cyan-500' },
  { to: '/companies', icon: Building2, label: 'Companies', color: 'from-purple-500 to-violet-500' },
  { to: '/knowledge-graph', icon: Network, label: 'Knowledge Graph', color: 'from-violet-500 to-purple-500' },
  { to: '/supply-chain', icon: GitBranch, label: 'Supply Chain', color: 'from-emerald-500 to-teal-500' },
  { to: '/analysis', icon: TrendingUp, label: 'Analysis', color: 'from-orange-500 to-amber-500' },
  { to: '/news', icon: Newspaper, label: 'Industry News', color: 'from-pink-500 to-rose-500' },
  { to: '/assistant', icon: MessageCircle, label: 'AI Assistant', color: 'from-indigo-500 to-blue-500' },
  { to: '/settings', icon: Settings, label: 'Settings', color: 'from-gray-500 to-gray-600' },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-black/5 hover:bg-white transition-all duration-200"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X size={22} className="text-gray-600" />
        ) : (
          <Menu size={22} className="text-gray-600" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Apple Glass Style */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-40
          transition-all duration-300 ease-out
          ${isCollapsed ? 'w-20' : 'w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div 
          className={`
            h-full flex flex-col
            bg-white/95 backdrop-blur-2xl
            border-r border-black/5
            ${!isCollapsed ? 'rounded-r-3xl ml-3 my-3' : 'rounded-r-2xl ml-2 my-3'}
            shadow-xl shadow-black/5
            transition-all duration-300
          `}
        >
          {/* Logo - Apple Style */}
          <div className="flex items-center justify-between h-20 px-5 border-b border-black/5">
            {!isCollapsed ? (
              <div className="flex items-center gap-4 px-2">
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div>
                  <span className="font-bold text-gray-900 text-[17px] tracking-tight">Industry Insight</span>
                  <p className="text-[11px] text-gray-400 font-medium -mt-0.5">Semiconductor Platform</p>
                </div>
              </div>
            ) : (
              <div className="mx-auto relative">
                <div className="w-11 h-11 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Collapse Toggle - Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3.5 top-24 w-7 h-7 bg-white rounded-full shadow-lg border border-black/10 items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:scale-110"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronLeft size={14} />
            )}
          </button>

          {/* Navigation - Apple Style */}
          <nav className="flex-1 py-5 px-3 overflow-y-auto scrollbar-thin">
            {!isCollapsed && (
              <div className="mb-4 px-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Navigation</p>
              </div>
            )}
            <div className="space-y-1">
              {navItems.map(({ to, icon: Icon, label, color }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3.5 px-3 py-3.5 rounded-xl
                    transition-all duration-200 ease-out
                    ${isCollapsed ? 'justify-center' : ''}
                    group relative
                    ${
                      isActive
                        ? `bg-gradient-to-r ${color} text-white shadow-lg`
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <Icon 
                        size={20} 
                        className={`
                          flex-shrink-0 transition-transform duration-200 
                          ${isActive ? '' : 'group-hover:scale-110'}
                        `} 
                      />
                      {!isCollapsed && (
                        <span className="font-semibold text-[14px]">{label}</span>
                      )}
                      
                      {/* Active Indicator */}
                      {!isActive && (
                        <div className={`
                          absolute left-0 top-1/2 -translate-y-1/2 w-1 
                          bg-gradient-to-b from-violet-500 to-purple-600 
                          rounded-r-full opacity-0 group-hover:opacity-100
                          transition-opacity duration-200
                          ${isCollapsed ? 'h-8' : 'h-6'}
                        `} />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Footer - Apple Style */}
          <div className="p-4 border-t border-black/5">
            {!isCollapsed ? (
              <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">System Status</p>
                </div>
                <p className="text-[12px] text-gray-600 font-medium">All systems operational</p>
                <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" />
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
