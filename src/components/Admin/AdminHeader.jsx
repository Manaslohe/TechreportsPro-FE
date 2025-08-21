import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, Search } from 'lucide-react';

const AdminHeader = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 -ml-2 text-gray-400 hover:text-gray-600 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-3">
           
           
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative max-w-xs hidden md:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Quick search..."
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-50/80 border-0 rounded-lg ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
   