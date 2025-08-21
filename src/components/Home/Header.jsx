import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import About from '../About/About';
import Toast from '../common/Toast'; // Import Toast

const NavButton = ({ children, variant = 'secondary', onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : variant === 'primary'
        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-blue-500/25 hover:shadow-lg'
        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
    }`}
  >
    {children}
  </button>
);

const Header = ({ handleNavigation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' }); // Toast state
  const location = useLocation();

  useEffect(() => {
    // Function to update user state from localStorage
    const updateUser = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    // Initial user state setup
    updateUser();

    // Listen for custom "authChange" events
    const handleAuthChange = () => updateUser();
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    handleNavigation('/');
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));

    // Show logout success toast
    setToast({
      show: true,
      message: 'Successfully logged out!',
      type: 'success',
    });
  };

  return (
    <>
      <nav
        className={`px-6 lg:px-8 py-4 flex justify-between items-center fixed w-full top-0 z-50 border-b border-blue-100 transition-all duration-300 ${
          isAboutOpen ? 'bg-white/70 backdrop-blur-sm' : 'bg-white/70'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
            <span className="text-white text-lg font-bold">T</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Techreportspro
            </span>
            <span className="text-xs text-blue-600/80">Investment Insights & Reports</span>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6">
            <AnimatePresence>
              {location.pathname !== '/' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <NavButton
                    onClick={() => handleNavigation('/')}
                    isActive={location.pathname === '/'}
                  >
                    Home
                  </NavButton>
                </motion.div>
              )}
            </AnimatePresence>
            <NavButton
              onClick={() => setIsAboutOpen(true)}
              isActive={isAboutOpen}
            >
              About
            </NavButton>
            <NavButton
              onClick={() => handleNavigation('/catalog')}
              isActive={location.pathname === '/catalog'}
            >
              Reports
            </NavButton>
            <NavButton
              onClick={() => handleNavigation('/contact')}
              isActive={location.pathname === '/contact'}
            >
              Contact
            </NavButton>
          </div>
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-red-500/25 hover:shadow-lg"
                >
                  Logout
                </button>
                <User className="text-gray-600" />
              </>
            ) : (
              <>
                <NavButton onClick={() => handleNavigation('/signin')}>Sign in</NavButton>
                <NavButton variant="primary" onClick={() => handleNavigation('/signup')}>
                  Get Started
                </NavButton>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-gray-600 hover:text-blue-600">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 lg:hidden">
            <div className="flex flex-col items-center gap-4 py-4">
              <AnimatePresence>
                {location.pathname !== '/' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <NavButton
                      onClick={() => {
                        handleNavigation('/');
                        toggleMenu();
                      }}
                      isActive={location.pathname === '/'}
                    >
                      Home
                    </NavButton>
                  </motion.div>
                )}
              </AnimatePresence>
              <NavButton
                onClick={() => setIsAboutOpen(true)}
                isActive={isAboutOpen}
              >
                About
              </NavButton>
              <NavButton
                onClick={() => {
                  handleNavigation('/catalog');
                  toggleMenu();
                }}
                isActive={location.pathname === '/catalog'}
              >
                Reports
              </NavButton>
              <NavButton
                onClick={() => {
                  handleNavigation('/contact');
                  toggleMenu();
                }}
                isActive={location.pathname === '/contact'}
              >
                Contact
              </NavButton>
              <div className="flex flex-col items-center gap-4 mt-4 border-t border-gray-200 pt-4">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-red-500/25 hover:shadow-lg"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <NavButton
                      onClick={() => {
                        handleNavigation('/signin');
                        toggleMenu();
                      }}
                    >
                      Sign in
                    </NavButton>
                    <NavButton
                      variant="primary"
                      onClick={() => {
                        handleNavigation('/signup');
                        toggleMenu();
                      }}
                    >
                      Get Started
                    </NavButton>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <About isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Toast Notification */}
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

