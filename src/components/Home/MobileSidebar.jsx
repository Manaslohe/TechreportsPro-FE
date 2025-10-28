import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home as HomeIcon, Info, FileText, Phone, Globe, LayoutDashboard, LogOut, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import logo from '../../../public/logo.png';

const MobileSidebar = ({ 
  isOpen, 
  onClose, 
  user, 
  language, 
  onLanguageChange, 
  onNavigate, 
  onLogout,
  translate 
}) => {
  const location = useLocation();

  const navigationItems = [
    { icon: HomeIcon, label: translate("home"), path: "/" },
    { icon: Info, label: translate("about"), action: "about" },
    { icon: FileText, label: translate("reports"), path: "/catalog" },
    { icon: Phone, label: translate("contact"), path: "/contact" },
  ];

  const handleNavigation = (item) => {
    if (item.action === "about") {
      // Trigger about modal through parent
      onNavigate("about");
    } else {
      onNavigate(item.path);
    }
    onClose();
  };

  const handleLanguageClick = (lang) => {
    onLanguageChange(lang);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                  <img src={logo} alt="Logo" className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">MarketMinds</h2>
                  <p className="text-xs text-gray-600 font-medium">Navigation Menu</p>
                </div>
              </div>
              <motion.button 
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* User Info Card (if logged in) */}
              {user && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-100 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-base font-bold shadow-md"
                    >
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <Sparkles size={16} className="text-blue-600" />
                  </div>
                </motion.div>
              )}

              {/* Language Switcher */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <motion.div 
                      whileHover={{ rotate: 180 }} 
                      transition={{ duration: 0.5 }}
                      className="p-2 bg-blue-50 rounded-lg"
                    >
                      <Globe size={18} className="text-blue-600" />
                    </motion.div>
                    <span className="text-sm font-bold text-gray-900">Language</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleLanguageClick('en')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                      language === 'en'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    English
                  </motion.button>
                  <motion.button
                    onClick={() => handleLanguageClick('hi')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                      language === 'hi'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    हिंदी
                  </motion.button>
                </div>
              </motion.div>

              {/* Navigation Links */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                    whileHover={{ x: 4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigation(item)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                      location.pathname === item.path
                        ? "bg-blue-50 border-2 border-blue-200 shadow-sm"
                        : "bg-white hover:bg-gray-50 border-2 border-gray-100"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      location.pathname === item.path ? "bg-blue-600" : "bg-gray-100"
                    }`}>
                      <item.icon size={20} className={
                        location.pathname === item.path ? "text-white" : "text-gray-600"
                      } />
                    </div>
                    <span className={`text-sm font-semibold ${
                      location.pathname === item.path ? "text-blue-700" : "text-gray-700"
                    }`}>
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </motion.div>

              {/* User Actions (if logged in) */}
              {user && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="space-y-2 pt-4 border-t-2 border-gray-100"
                >
                  <motion.button
                    whileHover={{ x: 4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onNavigate('/dashboard');
                      onClose();
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-blue-50 border-2 border-blue-100 hover:border-blue-200 transition-all"
                  >
                    <div className="p-2 rounded-lg bg-blue-600">
                      <LayoutDashboard size={20} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-blue-700">Dashboard</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ x: 4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-white hover:bg-red-50 border-2 border-gray-100 hover:border-red-200 transition-all"
                  >
                    <div className="p-2 rounded-lg bg-red-100">
                      <LogOut size={20} className="text-red-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors">Logout</span>
                  </motion.button>
                </motion.div>
              )}

              {/* Auth Buttons (if not logged in) */}
              {!user && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3 pt-4 border-t-2 border-gray-100"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onNavigate("/signin");
                      onClose();
                    }}
                    className="w-full px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-sm"
                  >
                    {translate("signin")}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onNavigate("/signup");
                      onClose();
                    }}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg"
                  >
                    {translate("getStartedC")}
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
