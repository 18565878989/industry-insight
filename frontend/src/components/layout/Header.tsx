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
    <header className="bg-black/80 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-20">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-white/40 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div 
            className={`
              relative hidden md:flex items-center
              transition-all duration-300 ease-out
              ${isSearchFocused ? 'w-72' : 'w-56'}
            `}
          >
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Search size={16} className={isSearchFocused ? 'text-white/60' : 'text-white/30'} />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`
                w-full pl-10 pr-4 py-2.5 
                bg-[#0a0a0a] backdrop-blur
                border border-white/[0.08]
                text-sm text-white placeholder:text-white/30
                transition-all duration-200
                focus:outline-none
                ${isSearchFocused 
                  ? 'border-white/20' 
                  : 'hover:border-white/[0.1]'
                }
              `}
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2.5 hover:bg-white/5 rounded-full transition-colors group">
            <Bell size={18} className="text-white/40 group-hover:text-white/60 transition-colors" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#E31937] rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
