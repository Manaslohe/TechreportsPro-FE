import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "./Home/Header";
import axios from 'axios';
import Toast from './common/Toast';
import { useTranslation } from "../contexts/TranslationContext";
import ForgotPassword from "./ForgotPassword"; // ADD

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
  const [showForgotPassword, setShowForgotPassword] = useState(false); // ADD

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
        const response = await axios.post(`${apiBaseUrl}/api/users/signin`, {
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
      
      <ForgotPassword 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
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
          className="max-w-6xl w-full mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200 flex overflow-hidden relative z-10 mt-4"
          style={{ height: '600px', maxHeight: '90vh' }}
        >
          {/* Left Column - Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full lg:w-1/2 p-8 lg:p-12 bg-white flex flex-col"
          >
            <div className="w-full max-w-md mx-auto h-full flex flex-col justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-center mb-10"
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
                  className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <User className="w-7 h-7 text-white" />
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="text-3xl font-bold text-gray-900 mb-2"
                >
                  {translate("welcomeBack")}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                  className="text-gray-500 text-sm"
                >
                  {translate("signinDescription")}
                </motion.p>
              </motion.div>

              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.3 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {translate("email")}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-11 w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {translate("password")}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-11 w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.5 }}
                    className="flex items-center justify-between"
                  >
                    <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="mr-2 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      {translate("rememberMe")}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                    >
                      Forgot Password?
                    </button>
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
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{translate("signingIn")}</span>
                    </motion.div>
                  ) : (
                    <>
                      <span>{translate("signin")}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.form>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.8 }}
                className="text-center mt-6 pt-6 border-t-2 border-gray-100"
              >
                <motion.p 
                  className="text-sm text-gray-600"
                  whileHover={{ scale: 1.02 }}
                >
                  {translate("dontHaveAccount")}{" "}
                  <motion.a
                    href="/signup"
                    onClick={handleSignUpClick}
                    className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {translate("signupHere")}
                    <ArrowRight className="w-4 h-4" />
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
            className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-50 to-indigo-50 p-10 relative overflow-hidden"
          >
            <div className="h-full w-full flex flex-col items-center justify-center relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                  delay: 0.8,
                  duration: 0.8 
                }}
                className="w-full max-w-lg"
              >
                <motion.img
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  src="/signin.png"
                  alt="Welcome back to our platform"
                  className="w-[70%] max-w-sm mx-auto object-contain -mb-5 drop-shadow-2xl"
                />
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                  className="space-y-5 text-center"
                >
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                    Welcome Back to <span className="text-blue-600">MarketMinds</span>
                  </h3>
                  <p className="text-gray-600 text-base max-w-lg mx-auto leading-relaxed px-4">
                    Access your dashboard and continue your investment research journey.
                  </p>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.6 }}
                    className="flex justify-center gap-6 mt-10 px-4"
                  >
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 1.7 }}
                      className="flex-1 max-w-[180px]"
                    >
                      <div className="bg-white rounded-2xl p-5 shadow-xl border-2 border-blue-100 hover:shadow-2xl transition-shadow">
                        <div className="w-10 h-10 mx-auto mb-3 bg-blue-100 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-7 h-7 text-blue-600" />
                        </div>
                        <p className="text-base font-bold text-gray-900">{translate("secure")}</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 1.8 }}
                      className="flex-1 max-w-[180px]"
                    >
                      <div className="bg-white rounded-2xl p-5 shadow-xl border-2 border-blue-100 hover:shadow-2xl transition-shadow">
                        <div className="w-10 h-10 mx-auto mb-3 bg-blue-100 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-7 h-7 text-blue-600" />
                        </div>
                        <p className="text-base font-bold text-gray-900">{translate("fast")}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
