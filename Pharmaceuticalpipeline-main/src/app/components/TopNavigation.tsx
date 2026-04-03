import { Search, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { Input } from './ui/input';

export function TopNavigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/pipeline', label: 'Pipeline' },
    { path: '/companies', label: 'Companies' },
    { path: '/news', label: 'News' },
    { path: '/settings', label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="flex items-center gap-6 h-16 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mr-4">
          <div className="size-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PP</span>
          </div>
          <span className="font-semibold text-lg">PharmaTrack</span>
        </Link>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search product, molecule, company..."
            className="pl-10 bg-slate-50 border-slate-200"
          />
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 ml-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <button className="size-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
          <User className="size-5 text-slate-600" />
        </button>
      </div>
    </header>
  );
}
