import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CURRENCIES } from '../../utils/helpers';

const pageNames = {
  '/': 'Dashboard',
  '/campaigns': 'Campaigns',
  '/campaigns/create': 'Create Campaign',
  '/targeting': 'Targeting & Bidding',
  '/creatives': 'Ad Creatives',
  '/placements': 'Ad Placements',
  '/analytics': 'Analytics & Reports',
  '/ai-assistant': 'AI Assistant',
  '/profile': 'My Profile',
};

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, currency, setCurrency, SUPPORTED_CURRENCIES } = useAuth();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const currentPage = pageNames[location.pathname] ||
    (pathSegments[0] === 'campaigns' && pathSegments[1] ? 'Campaign Detail' : 'Page');

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-40">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">Home</span>
        <span className="text-gray-300">/</span>
        <span className="text-primary font-medium">{currentPage}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Create Campaign */}
        <button
          onClick={() => navigate('/campaigns/create')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white gradient-primary hover:opacity-90 transition duration-200 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          New Campaign
        </button>

        {/* Currency selector */}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white cursor-pointer"
          title="Select currency"
        >
          {SUPPORTED_CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {CURRENCIES[code].symbol} {code}
            </option>
          ))}
        </select>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-48 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary pl-8"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>

        {/* Notification */}
        <button className="relative p-2 text-primary hover:bg-cream rounded-lg transition duration-200 cursor-pointer">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
        </button>

        {/* User avatar */}
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-primary text-white flex items-center justify-center text-xs font-bold">
              {user.avatar}
            </div>
            <span className="text-sm text-gray-700 font-medium">{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
}
