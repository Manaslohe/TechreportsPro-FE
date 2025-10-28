import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminHeader = ({ onMenuClick, title, subtitle }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-lg bg-white/50 border-b border-slate-200/30">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex h-12 items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMenuClick}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors lg:hidden flex-shrink-0"
            >
              <Menu size={18} />
            </motion.button>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-slate-900 truncate">{title}</h1>
              <p className="text-xs text-slate-500 truncate">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
            >
              <LogOut size={16} />
              <span className="hidden sm:block">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
