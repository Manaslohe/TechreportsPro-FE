import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "./Home/Header";
import axios from 'axios';
import Toast from './common/Toast';
import { useTranslation } from "../contexts/TranslationContext";

const apiBaseUrl = import.meta.env.MODE === 'production' 
  ? import.meta.env.VITE_REACT_APP_API_BASE_URL_PRODUCTION 
  : import.meta.env.VITE_REACT_APP_API_BASE_URL;

export default function SignInForm() {
  const navigate = useNavigate();
  const { translate } = useTranslation();
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Add background image preloader
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setTimeout(() => {
        setBackgroundLoaded(true);
      }, 500);
    };
    img.src = '/contactbg.png';
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const response = await axios.post(`${apiBaseUrl}/api/users/signin`, { // Corrected route
            email: formData.email,
            password: formData.password,
        });
        const { token, user } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));

        window.dispatchEvent(new Event('authChange'));

        setToast({
            show: true,
            message: 'Successfully signed in!',
            type: 'success'
        });

        setTimeout(() => navigate('/'), 2000);
    } catch (error) {
        setToast({
            show: true,
            message: error.response?.data?.error || 'Error signing in',
            type: 'error'
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    navigate('/signup', { 
      state: { direction: 'forward' }
    });
  };

  return (
    <>
      <Toast 
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      <div 
        className="min-h-screen relative flex items-center justify-center p-4 pt-24 overflow-hidden"
        style={{
          backgroundColor: '#ffffff'
        }}
      >
        {/* Background Image with Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: backgroundLoaded ? 1 : 0,
            scale: backgroundLoaded ? 1 : 1.1
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: backgroundLoaded ? 'url(/contactbg.png)' : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        />

        {/* Animated Background Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute inset-0 bg-white/5"
        />
        
        {/* Loading shimmer effect while background loads */}
        {!backgroundLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
          />
        )}
        
        <Header handleNavigation={(path) => window.location.href = path} />
        
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 25,
            duration: 0.6,
            delay: 0.2
          }}
          className="max-w-5xl w-full mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 flex overflow-hidden relative min-h-[450px] z-10 mt-4"
        >
          {/* Left Column - Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full lg:w-1/2 p-6 bg-white flex items-center"
          >
            <div className="w-full max-w-sm mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-center mb-6"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: 0.7 
                  }}
                  className="w-10 h-10 mx-auto mb-3 bg-blue-600 rounded-lg flex items-center justify-center"
                >
                  <User className="w-5 h-5 text-white" />
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="text-xl font-bold text-black mb-1"
                >
                  {translate("welcomeBack")}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                  className="text-gray-600 text-xs"
                >
                  {translate("signinDescription")}
                </motion.p>
              </motion.div>

              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                onSubmit={handleSubmit} 
                className="space-y-4"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.3 }}
                  >
                    <label className="block text-xs font-medium text-black mb-1.5">
                      {translate("email")}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-8 w-full px-3 py-2.5 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.4 }}
                  >
                    <label className="block text-xs font-medium text-black mb-1.5">
                      {translate("password")}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-8 w-full px-3 py-2.5 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.5 }}
                    className="flex items-center justify-between pt-1"
                  >
                    <label className="flex items-center text-xs text-gray-600">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="mr-2 h-3 w-3 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                      {translate("rememberMe")}
                    </label>
                  </motion.div>
                </div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center space-x-2"
                    >
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{translate("signingIn")}</span>
                    </motion.div>
                  ) : (
                    translate("signin")
                  )}
                </motion.button>
              </motion.form>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.8 }}
                className="text-center mt-4 pt-4 border-t border-gray-100"
              >
                <motion.p 
                  className="text-xs text-gray-600"
                  whileHover={{ scale: 1.02 }}
                >
                  {translate("dontHaveAccount")}{" "}
                  <motion.a
                    href="/signup"
                    onClick={handleSignUpClick}
                    className="text-blue-600 hover:text-blue-700 font-medium inline-block"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {translate("signupHere")} →
                  </motion.a>
                </motion.p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Enhanced Visual */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="hidden lg:block w-1/2 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 relative overflow-hidden"
          >
            <div className="h-full flex items-center justify-center relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                  delay: 0.8,
                  duration: 0.8 
                }}
                className="text-center"
              >
                <motion.img
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  src="/signin.png"
                  alt="Welcome back to our platform"
                  className="w-full max-w-xs object-contain mb-4 drop-shadow-lg"
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                  className="space-y-2"
                >
                  <h3 className="text-lg font-bold text-black">{translate("welcomeBackTitle")}</h3>
                  <p className="text-gray-700 max-w-xs mx-auto text-xs leading-relaxed">
                    {translate("accessDashboard")}
                  </p>
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.6 }}
                    className="flex justify-center gap-2 mt-4"
                  >
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 1.7 }}
                      className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-white/40"
                    >
                      <CheckCircle className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs font-medium text-black">{translate("secure")}</p>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 1.8 }}
                      className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-white/40"
                    >
                      <CheckCircle className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs font-medium text-black">{translate("fast")}</p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
