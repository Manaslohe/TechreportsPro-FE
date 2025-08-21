import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, ClipboardList, Mail, X, FileBarChart } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <FileText size={20} />, label: 'Reports', path: '/admin/reports' },
    { icon: <ClipboardList size={20} />, label: 'Requests', path: '/admin/requests' },
    { icon: <Users size={20} />, label: 'Users', path: '/admin/users' },
    { icon: <Mail size={20} />, label: 'Contacts', path: '/admin/contacts' },
  ];

  // Mobile overlay for when sidebar is open
  const overlayElement = isOpen && (
    <div 
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
      onClick={onClose}
    />
  );

  return (
    <>
      {overlayElement}
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 shadow-lg lg:shadow-none transform transition-all duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-semibold">T</span>
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  TechReportsPro
                </span>
                <span className="block text-xs text-slate-500 -mt-1">Admin Portal</span>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 lg:hidden transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <FileBarChart className="text-blue-600" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-slate-800">Reports Status</h3>
                  <p className="text-xs text-slate-500 mt-0.5">All systems operational</p>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-2 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`transition-colors ${
                        isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}>
                        {item.icon}
                      </span>
                      <span className="text-sm">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          <div className="p-4 mt-auto">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-xs text-slate-500 mb-2">Logged in as</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium">
                  A
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Admin User</p>
                  <p className="text-xs text-slate-500">admin@techreports.pro</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
