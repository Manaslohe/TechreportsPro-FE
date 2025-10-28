import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Globe, ChevronDown, LogOut, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import About from "../About/About";
import Toast from "../common/Toast";
import { useTranslation } from "../../contexts/TranslationContext";
import logo from "../../../public/logo.png"; // Import the logo

const NavButton = ({ children, variant = "secondary", onClick, isActive, isDark }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
      isActive
        ? `${isDark ? "text-white bg-white/10" : "text-blue-600 bg-blue-100"} border border-transparent`
        : variant === "primary"
        ? `${isDark ? "bg-white/20 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`
        : `${isDark ? "text-white/90 hover:text-white" : "text-blue-600 hover:text-blue-700"}`
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
    whileHover={{ scale: 1.05 }}
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

const UserDropdown = ({ user, onLogout, onNavigate, isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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
      {/* User Avatar Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
          isDark
            ? "bg-white/10 text-white hover:bg-white/20"
            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
        }`}
      >
        {/* Avatar Circle */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          isDark
            ? "bg-white text-blue-600"
            : "bg-blue-600 text-white"
        }`}>
          {getUserInitials()}
        </div>
        
        {/* User Name (hidden on mobile) */}
        <span className="hidden md:block text-sm font-medium truncate max-w-24">
          {user?.firstName || 'User'}
        </span>
        
        {/* Dropdown Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-lg border backdrop-blur-sm z-50 ${
              isDark
                ? "bg-white/95 border-white/20"
                : "bg-white/95 border-gray-200"
            }`}
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <motion.button
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                onClick={handleDashboardClick}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:text-blue-600 flex items-center gap-3 transition-colors"
              >
                <Settings size={16} />
                Dashboard
              </motion.button>
              
              <motion.button
                whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.05)" }}
                onClick={handleLogoutClick}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:text-red-600 flex items-center gap-3 transition-colors"
              >
                <LogOut size={16} />
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
      // Force white background on auth pages
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

  return (
    <>
      {/* Header */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`px-6 lg:px-8 py-4 flex justify-between items-center fixed w-full top-0 z-50 transition-all duration-300 backdrop-blur-sm ${
          isDarkBackground && !isAuthPage ? "bg-black/10" : "bg-white/95 shadow-sm"
        }`}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNavigation("/")}
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white shadow-md">
            <img src={logo} alt="MarketMinds Logo" className="w-7 h-7" /> {/* Use logo */}
          </div>
          <div className="flex flex-col">
            <span className={`text-lg font-bold ${isDarkBackground && !isAuthPage ? "text-white" : "text-blue-700"}`}>
              MarketMinds
            </span>
            <span className={`text-xs ${isDarkBackground && !isAuthPage ? "text-white/80" : "text-gray-600"}`}>
              Investment Insights & Reports
            </span>
          </div>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {/* Language Switcher */}
            <motion.div 
              className="flex items-center gap-2 mr-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <Globe size={18} className={isDarkBackground && !isAuthPage ? "text-white/80" : "text-blue-600"} />
              </motion.div>
              <motion.div 
                className="flex gap-1 p-1 rounded-lg"
                style={{
                  background: isDarkBackground && !isAuthPage ? "rgba(255, 255, 255, 0.05)" : "rgba(37, 99, 235, 0.05)"
                }}
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

            <AnimatePresence>
              {location.pathname !== "/" && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <NavButton
                    onClick={() => handleNavigation("/")}
                    isActive={location.pathname === "/"}
                    isDark={isDarkBackground && !isAuthPage}
                  >
                    {translate("home")}
                  </NavButton>
                </motion.div>
              )}
            </AnimatePresence>
            <NavButton onClick={() => setIsAboutOpen(true)} isActive={isAboutOpen} isDark={isDarkBackground && !isAuthPage}>
              {translate("about")}
            </NavButton>
            <NavButton
              onClick={() => handleNavigation("/catalog")}
              isActive={location.pathname === "/catalog"}
              isDark={isDarkBackground && !isAuthPage}
            >
              {translate("reports")}
            </NavButton>
            <NavButton
              onClick={() => handleNavigation("/contact")}
              isActive={location.pathname === "/contact"}
              isDark={isDarkBackground && !isAuthPage}
            >
              {translate("contact")}
            </NavButton>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
            {user ? (
              <UserDropdown
                user={user}
                onLogout={handleLogout}
                onNavigate={handleNavigation}
                isDark={isDarkBackground && !isAuthPage}
              />
            ) : (
              <>
                <NavButton onClick={() => handleNavigation("/signin")} isDark={isDarkBackground && !isAuthPage}>
                  {translate("signin")}
                </NavButton>
                <NavButton variant="primary" onClick={() => handleNavigation("/signup")} isDark={isDarkBackground && !isAuthPage}>
                  {translate("getStartedC")}
                </NavButton>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            className={`${isDarkBackground && !isAuthPage ? "text-white" : "text-blue-600"} p-2 rounded-lg`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 80 }}
            className="fixed top-0 right-0 w-3/4 h-full bg-white shadow-lg z-50 p-6 flex flex-col gap-6"
          >
            <button onClick={toggleMenu} className="self-end">
              <X size={28} className="text-blue-600" />
            </button>

            {/* Mobile User Info (if logged in) */}
            {user && (
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email}
                  </p>
                </div>
              </div>
            )}

            {/* Mobile Language Switcher */}
            <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
              <Globe size={18} className="text-blue-600" />
              <div className="flex gap-1 p-1 rounded-lg bg-blue-50">
                <LanguageButton
                  language="en"
                  currentLang={language}
                  onClick={setLanguage}
                  isDark={false}
                />
                <LanguageButton
                  language="hi"
                  currentLang={language}
                  onClick={setLanguage}
                  isDark={false}
                />
              </div>
            </div>

            <NavButton onClick={() => { handleNavigation("/"); toggleMenu(); }}>{translate("home")}</NavButton>
            <NavButton onClick={() => { setIsAboutOpen(true); toggleMenu(); }}>{translate("about")}</NavButton>
            <NavButton onClick={() => { handleNavigation("/catalog"); toggleMenu(); }}>{translate("reports")}</NavButton>
            <NavButton onClick={() => { handleNavigation("/contact"); toggleMenu(); }}>{translate("contact")}</NavButton>
            
            {user ? (
              <>
                <NavButton onClick={() => { handleNavigation("/dashboard"); toggleMenu(); }}>
                  Dashboard
                </NavButton>
                <NavButton variant="primary" onClick={handleLogout}>
                  {translate("logout")}
                </NavButton>
              </>
            ) : (
              <>
                <NavButton onClick={() => { handleNavigation("/signin"); toggleMenu(); }}>
                  {translate("signin")}
                </NavButton>
                <NavButton variant="primary" onClick={() => { handleNavigation("/signup"); toggleMenu(); }}>
                  {translate("getStarted")}
                </NavButton>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
