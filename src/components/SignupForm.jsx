import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "./Home/Header";
import axios from 'axios';
import Toast from './common/Toast';
import { useTranslation } from "../contexts/TranslationContext";
import TermsAndConditions from './Legal/TermsAndConditions';

const apiBaseUrl = import.meta.env.MODE === 'production' 
  ? import.meta.env.VITE_REACT_APP_API_BASE_URL_PRODUCTION 
  : import.meta.env.VITE_REACT_APP_API_BASE_URL;

export default function SignupForm() {
  const navigate = useNavigate();
  const { translate } = useTranslation();
  const [step, setStep] = useState(1);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      return formData.firstName && formData.lastName && formData.phone && formData.email;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep() && step < 2) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    setIsLoading(true);
    try {
        await axios.post(`${apiBaseUrl}/api/users/signup`, { // Corrected route
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
        });
      
      setShowSuccess(true);
      setToast({
        show: true,
        message: 'Account created successfully!',
        type: 'success'
      });
      
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.error || 'Error creating account',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  const renderStepContent = () => (
    <AnimatePresence mode="wait" custom={step}>
      <motion.div
        key={step}
        custom={step}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full"
      >
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 text-black">{translate("personalInformation")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {translate("firstName")}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="John"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {translate("lastName")}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-black mb-2">
                  {translate("phoneNumber")}
                </label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-gray-50 border border-gray-300 rounded-l-lg border-r-0">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-black font-medium">+91</span>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="flex-1 xl:w-35 px-4 py-3 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="000-000-0000"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-black mb-2">
                  {translate("email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 text-black">{translate("setPassword")}</h3>
            <div>
              <div className="relative mb-4">
                <label className="block text-sm font-medium text-black mb-2">
                  {translate("password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-black mb-2">
                  {translate("confirmPassword")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              {!passwordMatch && (
                <p className="text-red-500 text-sm mt-2">{translate("passwordsDoNotMatch")}</p>
              )}
            </div>
            <div className="mt-6">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  className="mr-2 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />
                {translate("agreeToTerms")}{" "}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-blue-600 hover:text-blue-700 hover:underline mx-1 font-medium"
                >
                  {translate("termsAndConditions")}
                </button>
              </label>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );

  const handleSignInClick = (e) => {
    e.preventDefault();
    navigate('/signin', { 
      state: { direction: 'back' }
    });
  };

  // Add success animation component
  const SuccessAnimation = () => (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 mx-auto mb-4 text-green-500"
        >
          <CheckCircle className="w-full h-full" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{translate("registrationSuccessful")}</h3>
        <p className="text-gray-600">{translate("redirectingToLogin")}</p>
      </motion.div>
    </motion.div>
  );

  // Add background image preloader
  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setTimeout(() => {
        setBackgroundLoaded(true);
      }, 500); // Delay to show the loading effect
    };
    img.src = '/contactbg.png';
  }, []);

  return (
    <>
      <Toast 
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      <TermsAndConditions 
        isOpen={showTerms} 
        onClose={() => setShowTerms(false)} 
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
          className="max-w-6xl w-full mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200 flex overflow-hidden relative min-h-[500px] z-10 mt-4"
        >
          {/* Left Column - Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full lg:w-1/2 p-8 bg-white"
          >
            <div className="max-w-md mx-auto">
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
                  className="w-12 h-12 mx-auto mb-3 bg-blue-600 rounded-xl flex items-center justify-center"
                >
                  <User className="w-6 h-6 text-white" />
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="text-2xl font-bold text-black mb-1"
                >
                  {step === 1 && translate("createAccount")}
                  {step === 2 && translate("secureAccount")}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                  className="text-gray-600 text-sm mb-2"
                >
                  {translate("stepOf", { current: step, total: 2 })}
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="flex justify-center space-x-2 mb-6"
                >
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: 24 }}
                    transition={{ duration: 0.4, delay: 1.1 }}
                    className={`h-1.5 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: 24 }}
                    transition={{ duration: 0.4, delay: 1.2 }}
                    className={`h-1.5 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}
                  />
                </motion.div>
              </motion.div>

              {/* Form content with staggered animation */}
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                {renderStepContent()}
                
                {/* Navigation buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.5 }}
                  className="flex justify-between pt-6"
                >
                  {step > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-black rounded-lg transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg border border-gray-200"
                    >
                      {translate("back")}
                    </motion.button>
                  )}
                  {step < 2 ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleNext}
                      disabled={!validateStep()}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium ml-auto shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <span>{translate("continue")}</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading || !formData.termsAccepted}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium ml-auto relative shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-center space-x-2"
                        >
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{translate("creating")}</span>
                        </motion.div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>{translate("createAccountButton")}</span>
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}
                    </motion.button>
                  )}
                </motion.div>
              </motion.form>

              {/* Login link with animation */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.7 }}
                className="text-center mt-6 pt-6 border-t border-gray-100"
              >
                <motion.p 
                  className="text-sm text-gray-600"
                  whileHover={{ scale: 1.02 }}
                >
                  {translate("alreadyHaveAccount")}{" "}
                  <motion.a
                    href="/signin"
                    onClick={handleSignInClick}
                    className="text-blue-600 hover:text-blue-700 font-medium inline-block"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {translate("signinHere")} →
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
            className="hidden lg:block w-1/2 bg-gray-50 p-8 relative overflow-hidden"
          >
            <div className="h-full flex items-center justify-center relative z-10">
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
                className="text-center"
              >
                <motion.img
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  src="/signup.png"
                  alt="Join our professional platform"
                  className="w-full max-w-md object-contain mb-6 drop-shadow-2xl"
                />
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                  className="space-y-3"
                >
                  <h3 className="text-xl font-bold text-black">{translate("joinPlatform")}</h3>
                  <p className="text-gray-700 max-w-xs mx-auto text-sm leading-relaxed">
                    {translate("unlockPowerfulTools")}
                  </p>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.6 }}
                    className="grid grid-cols-2 gap-3 mt-6"
                  >
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 1.7 }}
                      className="bg-white rounded-lg p-3 shadow-lg border border-gray-200"
                    >
                      <CheckCircle className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs font-medium text-black">{translate("secureReliable")}</p>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 1.8 }}
                      className="bg-white rounded-lg p-3 shadow-lg border border-gray-200"
                    >
                      <CheckCircle className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs font-medium text-black">{translate("professionalTools")}</p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      {showSuccess && <SuccessAnimation />}
    </>
  );
}

