import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, ClipboardList, Mail, X, BarChart3, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: FileText, label: 'Reports', path: '/admin/reports' },
  { icon: ClipboardList, label: 'Requests', path: '/admin/requests' },
  { icon: Mail, label: 'Contacts', path: '/admin/contacts' },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  // Overlay for mobile
  const overlayElement = isOpen && (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
      onClick={onClose}
    />
  );

  return (
    <>
      {overlayElement}

      {/* Mobile sidebar (slide-in) */}
      <motion.aside
        initial={{ x: -256 }}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/50 backdrop-blur-sm flex flex-col overflow-hidden lg:hidden shadow-xl"
      >
        {/* Header */}
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between gap-3">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2.5 flex-1"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <BarChart3 className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">MarketMinds</p>
                <p className="text-xs text-slate-500">Admin</p>
              </div>
            </motion.div>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose} 
              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </motion.button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-hide">
          <div className="space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-md">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900">Admin</p>
                <p className="text-xs text-slate-500 truncate">admin@MarketMinds.pro</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Desktop sidebar (always visible) */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-64 bg-white border-r border-slate-200/50 backdrop-blur-sm overflow-hidden">
        {/* Logo Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4 py-4 border-b border-slate-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <BarChart3 className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900">MarketMinds</p>
              <p className="text-xs text-slate-500">Admin Portal</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation with enhanced styling */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-hide">
          <div className="space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.05, duration: 0.3 }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon size={18} className={`transition-transform ${isActive ? 'scale-110' : ''}`} />
                        <span className="flex-1">{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-1 h-1 rounded-full bg-white"
                          />
                        )}
                        {!isActive && (
                          <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </>
                    )}
                  </NavLink>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation divider */}
          <div className="my-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          {/* Additional info section */}
          <div className="px-3 py-3">
            <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">Quick Stats</p>
            <div className="space-y-2">
              <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-xs text-indigo-600 font-medium">Active Sessions</p>
                <p className="text-lg font-bold text-indigo-700 mt-1">1</p>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                <p className="text-xs text-emerald-600 font-medium">System Status</p>
                <p className="text-lg font-bold text-emerald-700 mt-1">Normal</p>
              </div>
            </div>
          </div>
        </nav>

        {/* Footer section with enhanced design */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="p-4 border-t border-slate-100 bg-gradient-to-t from-slate-50 to-transparent"
        >
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-lg p-3 border border-indigo-200/50 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-md">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900">Administrator</p>
                <p className="text-xs text-slate-600 truncate">admin@MarketMinds.pro</p>
              </div>
            </div>
          </div>
        </motion.div>
      </aside>
    </>
  );
};

export default AdminSidebar;
