import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, CheckCircle, Send, ChevronDown } from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "../../contexts/TranslationContext";

const Contact = () => {
  const { translate } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [selectedCountry, setSelectedCountry] = useState({
    value: '+91',
    label: 'IN',
    country: 'India'
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.4
      }
    }
  };

  const formVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 30
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1],
        type: "spring",
        stiffness: 100
      }
    }
  };

  const leftColumnVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { 
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.6
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.8
      }
    }
  };

  const contactItemVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: 1.0 + (i * 0.15)
      }
    })
  };

  const socialLinksVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: 1.8,
        staggerChildren: 0.1
      }
    }
  };

  const socialItemVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 150
      }
    }
  };

  const formFieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.2 + (i * 0.05)
      }
    })
  };

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setToast({
        show: true,
        message: 'Your message has been sent successfully!',
        type: 'success'
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setToast({
        show: true,
        message: 'Error submitting the form',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Country codes data
  const countryCodes = [
    { value: '+91', label: 'IN', country: 'India' },
    { value: '+1', label: 'US', country: 'United States' },
    { value: '+44', label: 'GB', country: 'United Kingdom' },
    { value: '+86', label: 'CN', country: 'China' },
    { value: '+81', label: 'JP', country: 'Japan' },
    { value: '+49', label: 'DE', country: 'Germany' },
    { value: '+33', label: 'FR', country: 'France' },
    { value: '+39', label: 'IT', country: 'Italy' },
    { value: '+34', label: 'ES', country: 'Spain' },
    { value: '+7', label: 'RU', country: 'Russia' },
    { value: '+55', label: 'BR', country: 'Brazil' },
    { value: '+52', label: 'MX', country: 'Mexico' },
    { value: '+61', label: 'AU', country: 'Australia' },
    { value: '+82', label: 'KR', country: 'South Korea' },
    { value: '+90', label: 'TR', country: 'Turkey' },
    { value: '+966', label: 'SA', country: 'Saudi Arabia' },
    { value: '+971', label: 'AE', country: 'United Arab Emirates' },
    { value: '+65', label: 'SG', country: 'Singapore' },
    { value: '+60', label: 'MY', country: 'Malaysia' },
    { value: '+66', label: 'TH', country: 'Thailand' },
    { value: '+84', label: 'VN', country: 'Vietnam' },
    { value: '+62', label: 'ID', country: 'Indonesia' },
    { value: '+63', label: 'PH', country: 'Philippines' },
    { value: '+92', label: 'PK', country: 'Pakistan' },
    { value: '+880', label: 'BD', country: 'Bangladesh' },
    { value: '+94', label: 'LK', country: 'Sri Lanka' },
    { value: '+977', label: 'NP', country: 'Nepal' },
    { value: '+27', label: 'ZA', country: 'South Africa' },
    { value: '+20', label: 'EG', country: 'Egypt' },
    { value: '+234', label: 'NG', country: 'Nigeria' },
    { value: '+254', label: 'KE', country: 'Kenya' }
  ];

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-700 to-blue-700 p-2 sm:p-4 lg:p-8">
      <motion.div
        className="min-h-screen flex items-center justify-center py-4 sm:py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 xl:gap-16 items-stretch">
            
            {/* Left Column - Contact Information */}
            <motion.div
              variants={leftColumnVariants}
              // Add responsive order and spacing for mobile
              className="text-white p-4 sm:p-6 lg:p-12 flex flex-col justify-center
                order-1 lg:order-1
                mt-16 sm:mt-0
              "
            >
              {/* Add top margin only on mobile to prevent overlap with header */}
              <motion.div
                variants={titleVariants}
                className="mb-6 sm:mb-8 lg:mb-12"
              >
                <motion.h1 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.9 }}
                  // Add extra top margin on mobile
                  style={{ marginTop: '0.5rem' }}
                >
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                  >
                    {translate("lets")}{" "}
                  </motion.span>
                  <motion.span 
                    className="text-blue-200"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                  >
                    {translate("connect")}
                  </motion.span>
                </motion.h1>
              </motion.div>

              <div className="space-y-4 sm:space-y-6 lg:space-y-8 mb-6 sm:mb-8 lg:mb-12">
                {/* Email */}
                <motion.div 
                  className="flex items-start gap-3 sm:gap-4 group cursor-pointer"
                  variants={contactItemVariants}
                  custom={0}
                  whileHover={{ x: 8, transition: { type: "spring", stiffness: 400 } }}
                  onClick={() => handleCopy('info.marketmindsresearch@gmail.com')}
                >
                  <motion.div 
                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all backdrop-blur-sm"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <p className="text-blue-200 text-xs sm:text-sm font-medium mb-1">{translate("emailUs")}</p>
                    <p className="text-white font-semibold text-sm sm:text-lg break-all">
                      info.marketmindsresearch@gmail.com
                    </p>
                    {copied === 'info.marketmindsresearch@gmail.com' && (
                      <motion.span 
                        initial={{ opacity: 0, y: -10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="text-green-300 text-xs font-medium flex items-center gap-1 mt-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        {translate("copied")}
                      </motion.span>
                    )}
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div 
                  className="flex items-start gap-3 sm:gap-4 group cursor-pointer"
                  variants={contactItemVariants}
                  custom={1}
                  whileHover={{ x: 8, transition: { type: "spring", stiffness: 400 } }}
                  onClick={() => handleCopy('+91 7987090461')}
                >
                  <motion.div 
                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all backdrop-blur-sm"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-blue-200 text-xs sm:text-sm font-medium mb-1">{translate("callUs")}</p>
                    <p className="text-white font-semibold text-sm sm:text-lg">
                      +91 7987090461
                    </p>
                    <p className="text-blue-100 text-xs sm:text-sm">Mon – Sat 9am – 6pm IST</p>
                    {copied === '+91 7987090461' && (
                      <motion.span 
                        initial={{ opacity: 0, y: -10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="text-green-300 text-xs font-medium flex items-center gap-1 mt-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        {translate("copied")}
                      </motion.span>
                    )}
                  </div>
                </motion.div>

                {/* WhatsApp */}
                <motion.div 
                  className="flex items-start gap-3 sm:gap-4 group cursor-pointer"
                  variants={contactItemVariants}
                  custom={2}
                  whileHover={{ x: 8, transition: { type: "spring", stiffness: 400 } }}
                  onClick={() => window.open('https://wa.me/917987090461', '_blank')}
                >
                  <motion.div 
                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-all backdrop-blur-sm border border-green-300/20"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6 text-green-300" />
                  </motion.div>
                  <div>
                    <p className="text-blue-200 text-xs sm:text-sm font-medium mb-1">{translate("connectOn")}</p>
                    <p className="text-white font-semibold text-sm sm:text-lg">
                      WhatsApp
                    </p>
                    <p className="text-blue-100 text-xs sm:text-sm">Mon – Sat 9am – 6pm IST</p>
                  </div>
                </motion.div>

                {/* Instagram */}
                <motion.div 
                  className="flex items-start gap-3 sm:gap-4 group cursor-pointer"
                  variants={contactItemVariants}
                  custom={3}
                  whileHover={{ x: 8, transition: { type: "spring", stiffness: 400 } }}
                  onClick={() => window.open('https://www.instagram.com/marketmindsresearch/?igsh=MTN4NXNrbG5xNHRuOA%3D%3D#', '_blank')}
                >
                  <motion.div 
                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover:from-pink-500/30 group-hover:to-purple-500/30 transition-all backdrop-blur-sm border border-pink-300/20"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6 text-pink-300" />
                  </motion.div>
                  <div>
                    <p className="text-blue-200 text-xs sm:text-sm font-medium mb-1">Follow us on</p>
                    <p className="text-white font-semibold text-sm sm:text-lg">
                      Instagram
                    </p>
                    <p className="text-blue-100 text-xs sm:text-sm">@marketmindsresearch</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Contact Form Card */}
            <motion.div
              variants={formVariants}
              // Change order for mobile so form comes after left section
              className="order-2 lg:order-2 flex items-center"
            >
              <motion.div 
                className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-10 mx-auto max-w-lg lg:max-w-none w-full border border-gray-100"
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <motion.div
                      variants={formFieldVariants}
                      custom={0}
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                        Your name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50/80 border border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                        placeholder="Your name"
                        required
                      />
                    </motion.div>
                    <motion.div
                      variants={formFieldVariants}
                      custom={1}
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50/80 border border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                        placeholder="Last name"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    variants={formFieldVariants}
                    custom={2}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50/80 border border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                      placeholder="name@company.com"
                      required
                    />
                  </motion.div>

                  {/* Enhanced Mobile-Responsive Phone Number Field */}
                  <motion.div
                    variants={formFieldVariants}
                    custom={3}
                    className="relative"
                  >
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      Phone number
                    </label>
                    <div className="relative">
                      {/* Mobile-First Phone Input Container */}
                      <div className="flex items-stretch bg-gray-50/80 border border-gray-200 rounded-lg sm:rounded-xl hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 focus-within:bg-white transition-all duration-300">
                        
                        {/* Country Code Dropdown - Mobile Optimized */}
                        <div className="relative flex-shrink-0">
                          <motion.button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-100/50 rounded-l-lg sm:rounded-l-xl transition-colors duration-200 border-r border-gray-200/80 min-w-[90px] sm:min-w-[120px] justify-center"
                            whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <ReactCountryFlag
                              countryCode={selectedCountry.label}
                              svg
                              style={{
                                width: '16px',
                                height: '12px',
                                borderRadius: '2px'
                              }}
                              className="sm:w-5 sm:h-4"
                            />
                            <span className="font-semibold text-gray-700 text-xs sm:text-sm">
                              {selectedCountry.value}
                            </span>
                            <ChevronDown 
                              className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform duration-200 ${
                                isDropdownOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </motion.button>

                          {/* Mobile-Optimized Dropdown Menu */}
                          {isDropdownOpen && (
                            <>
                              {/* Backdrop */}
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setIsDropdownOpen(false)}
                              />
                              
                              {/* Dropdown Content - Mobile Responsive */}
                              <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-xl z-50 max-h-56 sm:max-h-64 overflow-y-auto"
                              >
                                <div className="p-1.5 sm:p-2">
                                  {countryCodes.map((country) => (
                                    <motion.button
                                      key={country.label}
                                      type="button"
                                      onClick={() => handleCountrySelect(country)}
                                      className="w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 hover:bg-blue-50 rounded-md sm:rounded-lg transition-colors duration-150 text-left"
                                      whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <ReactCountryFlag
                                        countryCode={country.label}
                                        svg
                                        style={{
                                          width: '20px',
                                          height: '15px',
                                          borderRadius: '3px',
                                          flexShrink: 0
                                        }}
                                        className="sm:w-6 sm:h-5"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                          <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                                            {country.value}
                                          </span>
                                          <span className="text-gray-500 text-xs sm:text-sm truncate">
                                            {country.country}
                                          </span>
                                        </div>
                                      </div>
                                      {selectedCountry.label === country.label && (
                                        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                                      )}
                                    </motion.button>
                                  ))}
                                </div>
                              </motion.div>
                            </>
                          )}
                        </div>

                        {/* Phone Number Input */}
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border-none rounded-r-lg sm:rounded-r-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 text-sm sm:text-base"
                          placeholder="Enter phone number"
                          maxLength="15"
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={formFieldVariants}
                    custom={4}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50/80 border border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none hover:border-gray-300 text-sm sm:text-base"
                      placeholder="Tell us about your project..."
                      required
                    />
                  </motion.div>

                  <motion.button
                    variants={formFieldVariants}
                    custom={5}
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <motion.div 
                        className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <>
                        {translate("sendMessage")}
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </motion.div>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Mobile-Optimized Toast Notification */}
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-2 sm:bottom-4 left-2 right-2 sm:left-auto sm:right-4 sm:max-w-sm z-50"
        >
          <div className={`px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-2xl flex items-center gap-2 sm:gap-3 backdrop-blur-lg ${
            toast.type === 'success' 
              ? 'bg-green-500/90 text-white' 
              : 'bg-red-500/90 text-white'
          }`}>
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
            <span className="font-medium text-sm sm:text-base flex-1">{translate(toast.message)}</span>
            <button 
              onClick={() => setToast({ ...toast, show: false })}
              className="ml-2 hover:opacity-70 text-lg sm:text-xl leading-none flex-shrink-0"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Contact;