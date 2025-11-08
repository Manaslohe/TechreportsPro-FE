import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, LayoutDashboard, Users, FileText, ClipboardList, Gift, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminHeader = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  // Define route-based titles and subtitles
  const getPageInfo = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/admin/dashboard':
        return {
          title: 'Dashboard',
          subtitle: 'Overview and analytics',
          icon: LayoutDashboard
        };
      case '/admin/users':
        return {
          title: 'Users',
          subtitle: 'Manage user accounts and permissions',
          icon: Users
        };
      case '/admin/reports':
        return {
          title: 'Reports',
          subtitle: 'Manage investment reports and content',
          icon: FileText
        };
      case '/admin/requests':
        return {
          title: 'Requests',
          subtitle: 'Review and approve access requests',
          icon: ClipboardList
        };
      case '/admin/grant-access':
        return {
          title: 'Submit for Approval',
          subtitle: 'Create access requests for users (requires approval)',
          icon: Gift
        };
      case '/admin/contacts':
        return {
          title: 'Contact Submissions',
          subtitle: 'View and manage user contact messages',
          icon: Mail
        };
      default:
        return {
          title: 'Admin Panel',
          subtitle: 'Management dashboard',
          icon: LayoutDashboard
        };
    }
  };

  const { title, subtitle, icon: PageIcon } = getPageInfo();

  return (
    <header className="sticky top-0 z-30 backdrop-blur-lg bg-white/80 border-b border-slate-200/50">
      <div className="px-4 sm:px-6 py-4">
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
            
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <PageIcon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-slate-900 truncate">{title}</h1>
                <p className="text-sm text-slate-600 truncate">{subtitle}</p>
              </div>
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
