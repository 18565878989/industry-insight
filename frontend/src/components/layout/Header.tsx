import { Search, Bell } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-black/5 sticky top-0 z-20">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Title - Apple Style */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search - Apple Style */}
          <div 
            className={`
              relative hidden md:flex items-center
              transition-all duration-300 ease-out
              ${isSearchFocused ? 'w-80' : 'w-64'}
            `}
          >
            <div 
              className={`
                absolute left-3 top-1/2 -translate-y-1/2
                transition-colors duration-200
                ${isSearchFocused ? 'text-violet-500' : 'text-gray-400'}
              `}
            >
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search companies, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`
                w-full pl-10 pr-4 py-2.5 
                bg-gray-100/80 backdrop-blur
                border border-transparent
                rounded-xl text-sm
                placeholder:text-gray-400
                transition-all duration-200
                focus:outline-none
                ${isSearchFocused 
                  ? 'bg-white border-violet-200/50 shadow-lg shadow-violet-500/10' 
                  : 'hover:bg-gray-100'
                }
              `}
            />
          </div>

          {/* Notifications - Apple Style */}
          <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors group">
            <Bell size={20} className="text-gray-500 group-hover:text-gray-700 transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>
        </div>
      </div>
    </header>
  );
}
