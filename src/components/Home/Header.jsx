import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Globe, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { useLocation } from "react-router-dom";
import About from "../About/About";
import Toast from "../common/Toast";
import { useTranslation } from "../../contexts/TranslationContext";
import MobileSidebar from "./MobileSidebar";
import logo from "../../../public/logo.png";

const NavButton = ({ children, variant = "secondary", onClick, isActive, isDark, index = 0 }) => (
  <motion.button
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 + index * 0.05, duration: 0.4, ease: "easeOut" }}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
      isActive
        ? `${isDark ? "text-white bg-white/10" : "text-blue-600 bg-blue-100"} border border-transparent shadow-sm`
        : variant === "primary"
        ? `${isDark ? "bg-white/20 text-white hover:bg-white/30" : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"}`
        : `${isDark ? "text-white/90 hover:text-white hover:bg-white/5" : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"}`
    }`}
  >
    {children}
  </motion.button>
);

const LanguageButton = ({ language, currentLang, onClick, isDark }) => (
  <motion.button
    onClick={() => onClick(language)}
    className={`px-3 py-1 rounded-md text-sm font-medium relative ${
      isDark
        ? "text-white hover:text-white"
        : "text-blue-600 hover:text-blue-700"
    }`}
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    animate={{
      color: currentLang === language 
        ? (isDark ? "rgb(255, 255, 255)" : "rgb(37, 99, 235)") 
        : (isDark ? "rgba(255, 255, 255, 0.8)" : "rgb(37, 99, 235)")
    }}
    transition={{ duration: 0.2 }}
  >
    {language.toUpperCase()}
    {currentLang === language && (
      <motion.div
        layoutId="langHighlight"
        className={`absolute inset-0 rounded-md -z-10 ${
          isDark ? "bg-white/20" : "bg-blue-100"
        }`}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    )}
  </motion.button>
);

// Enhanced UserDropdown with smoother animations
const UserDropdown = ({ user, onLogout, onNavigate, isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserInitials = () => {
    if (!user?.firstName || !user?.lastName) return 'U';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const truncateName = (name) => {
    if (!name) return '';
    return name.length > 5 ? `${name.slice(0, 5)}...` : name;
  };

  const handleDashboardClick = () => {
    onNavigate('/dashboard');
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 ${
          isDark
            ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
            : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100"
        }`}
      >
        <motion.div 
          whileHover={{ rotate: 5 }}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm ${
            isDark
              ? "bg-white text-blue-600"
              : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
          }`}
        >
          {getUserInitials()}
        </motion.div>
        <span className="hidden md:block text-sm font-semibold max-w-24" title={user?.firstName || 'User'}>
          {truncateName(user?.firstName || 'User')}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl border backdrop-blur-lg z-50 bg-white/98 border-gray-100 overflow-hidden"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100"
            >
              <p className="text-sm font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-600 truncate mt-0.5">
                {user?.email}
              </p>
            </motion.div>

            <div className="py-2">
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.08)", x: 4 }}
                onClick={handleDashboardClick}
                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center gap-3 transition-all"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.08)", x: 4 }}
                onClick={handleLogoutClick}
                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:text-red-600 flex items-center gap-3 transition-all"
              >
                <LogOut size={18} />
                Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header = ({ handleNavigation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [isDarkBackground, setIsDarkBackground] = useState(true);
  const location = useLocation();
  const { language, setLanguage, translate } = useTranslation();

  // Check if we're on auth pages
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    updateUser();

    const handleAuthChange = () => updateUser();
    window.addEventListener("authChange", handleAuthChange);

    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Force white background on auth pages, otherwise dark at top (< 80px scroll)
      if (isAuthPage) {
        setIsDarkBackground(false);
      } else {
        setIsDarkBackground(window.scrollY < 80);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAuthPage]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    handleNavigation("/");
    window.dispatchEvent(new Event("authChange"));
    setToast({ show: true, message: "Successfully logged out!", type: "success" });
  };

  const handleMobileNavigation = (path) => {
    if (path === "about") {
      setIsAboutOpen(true);
    } else {
      handleNavigation(path);
    }
  };

  return (
    <>
      {/* Header with restored color scheme */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`px-6 lg:px-8 py-4 flex justify-between items-center fixed w-full top-0 z-50 transition-all duration-500 ${
          isDarkBackground && !isAuthPage 
            ? "bg-blue-900/30 backdrop-blur-lg shadow-2xl border-b border-white/10" 
            : "bg-white shadow-md border-b border-gray-100"
        }`}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -30, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          whileHover={{ scale: 1.03 }}
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleNavigation("/")}
        >
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
              isDarkBackground && !isAuthPage
                ? "bg-white/95 group-hover:shadow-white/20"
                : "bg-blue-600 group-hover:shadow-blue-300"
            }`}
          >
            <img src={logo} alt="MarketMinds Logo" className="w-7 h-7" />
          </motion.div>
          <div className="flex flex-col">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-lg font-bold tracking-tight ${isDarkBackground && !isAuthPage ? "text-white" : "text-blue-700"}`}
            >
              MarketMinds
            </motion.span>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`text-[10px] font-medium tracking-wide ${isDarkBackground && !isAuthPage ? "text-white/80" : "text-gray-600"}`}
            >
              Investment Insights & Reports
            </motion.span>
          </div>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {/* Language Switcher */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex items-center gap-2.5 mr-4"
            >
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`p-1.5 rounded-lg ${
                  isDarkBackground && !isAuthPage
                    ? "bg-white/10"
                    : "bg-blue-50"
                }`}
              >
                <Globe size={18} className={isDarkBackground && !isAuthPage ? "text-white/90" : "text-blue-600"} />
              </motion.div>
              <motion.div 
                className={`flex gap-1 p-1 rounded-xl backdrop-blur-sm border ${
                  isDarkBackground && !isAuthPage
                    ? "bg-white/10 border-white/20"
                    : "bg-blue-50 border-blue-100"
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <LanguageButton
                  language="en"
                  currentLang={language}
                  onClick={setLanguage}
                  isDark={isDarkBackground && !isAuthPage}
                />
                <LanguageButton
                  language="hi"
                  currentLang={language}
                  onClick={setLanguage}
                  isDark={isDarkBackground && !isAuthPage}
                />
              </motion.div>
            </motion.div>

            <AnimatePresence mode="wait">
              {location.pathname !== "/" && (
                <NavButton
                  onClick={() => handleNavigation("/")}
                  isActive={location.pathname === "/"}
                  isDark={isDarkBackground && !isAuthPage}
                  index={0}
                >
                  {translate("home")}
                </NavButton>
              )}
            </AnimatePresence>
            <NavButton 
              onClick={() => setIsAboutOpen(true)} 
              isActive={isAboutOpen} 
              isDark={isDarkBackground && !isAuthPage}
              index={1}
            >
              {translate("about")}
            </NavButton>
            <NavButton
              onClick={() => handleNavigation("/catalog")}
              isActive={location.pathname === "/catalog"}
              isDark={isDarkBackground && !isAuthPage}
              index={2}
            >
              {translate("reports")}
            </NavButton>
            <NavButton
              onClick={() => handleNavigation("/contact")}
              isActive={location.pathname === "/contact"}
              isDark={isDarkBackground && !isAuthPage}
              index={3}
            >
              {translate("contact")}
            </NavButton>
          </div>

          {/* Auth Buttons */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className={`flex items-center gap-4 ml-4 pl-4 border-l ${
              isDarkBackground && !isAuthPage ? "border-white/20" : "border-gray-200"
            }`}
          >
            {user ? (
              <UserDropdown
                user={user}
                onLogout={handleLogout}
                onNavigate={handleNavigation}
                isDark={isDarkBackground && !isAuthPage}
              />
            ) : (
              <>
                <NavButton 
                  onClick={() => handleNavigation("/signin")} 
                  isDark={isDarkBackground && !isAuthPage}
                  index={4}
                >
                  {translate("signin")}
                </NavButton>
                <NavButton 
                  variant="primary" 
                  onClick={() => handleNavigation("/signup")} 
                  isDark={isDarkBackground && !isAuthPage}
                  index={5}
                >
                  {translate("getStartedC")}
                </NavButton>
              </>
            )}
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="lg:hidden"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              isDarkBackground && !isAuthPage 
                ? "bg-white/10 text-white hover:bg-white/20 border border-white/20" 
                : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100"
            }`}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        language={language}
        onLanguageChange={setLanguage}
        onNavigate={handleMobileNavigation}
        onLogout={handleLogout}
        translate={translate}
      />

      <About isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </>
  );
};

export default Header;
