import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Globe } from "lucide-react";
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
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isDarkBackground && !isAuthPage
                      ? "bg-red-600/80 text-white"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {translate("logout")}
                </motion.button>
                <User className={isDarkBackground && !isAuthPage ? "text-white" : "text-blue-600"} />
              </>
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
              <NavButton variant="primary" onClick={handleLogout}>{translate("logout")}</NavButton>
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
