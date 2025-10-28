import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, CheckCircle, Send, ChevronDown, Clock, Sparkles } from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "../../contexts/TranslationContext";
import axios from "axios";
import Toast from "../common/Toast";

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
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
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const fullPhone = `${selectedCountry.value}${formData.phone}`;
      
      await axios.post(`${baseURL}/api/contact`, {
        ...formData,
        phone: fullPhone,
        country: selectedCountry.country
      });
      
      setToast({
        show: true,
        message: translate('messageSentSuccess'),
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
        message: translate('errorSubmittingForm'),
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="min-h-screen bg-blue-600 p-4 sm:p-6 lg:p-8 pt-4">
      <motion.div
        className="min-h-screen flex items-center justify-center py-8 sm:py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-stretch">
            
            {/* Left Column - Contact Information */}
            <motion.div
              variants={itemVariants}
              className="text-white p-6 sm:p-8 lg:p-12 flex flex-col justify-center order-1 lg:order-1 mt-8"
            >
              <motion.div
                variants={itemVariants}
                className="mb-8 lg:mb-12"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20"
                >
                  <Sparkles className="h-4 w-4" />
                  {translate('getInTouch')}
                </motion.div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {translate("lets")}{" "}
                  </motion.span>
                  <motion.span 
                    className="text-blue-200"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {translate("connect")}
                  </motion.span>
                </h1>
              </motion.div>

              <div className="space-y-6 mb-8 lg:mb-12">
                {/* Email */}
                <motion.div 
                  variants={itemVariants}
                  className="flex items-start gap-4 group cursor-pointer p-4 rounded-xl hover:bg-white/5 transition-all"
                  whileHover={{ x: 8 }}
                  onClick={() => handleCopy('info.marketmindsresearch@gmail.com')}
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10"
                  >
                    <Mail className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <p className="text-blue-200 text-sm font-medium mb-1">{translate("emailUs")}</p>
                    <p className="text-white font-semibold text-base lg:text-lg break-all">
                      info.marketmindsresearch@gmail.com
                    </p>
                    {copied === 'info.marketmindsresearch@gmail.com' && (
                      <motion.span 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-green-300 text-xs font-medium flex items-center gap-1 mt-2"
                      >
                        <CheckCircle className="w-3 h-3" />
                        {translate("copied")}
                      </motion.span>
                    )}
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div 
                  variants={itemVariants}
                  className="flex items-start gap-4 group cursor-pointer p-4 rounded-xl hover:bg-white/5 transition-all"
                  whileHover={{ x: 8 }}
                  onClick={() => handleCopy('+91 7987090461')}
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10"
                  >
                    <Phone className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-blue-200 text-sm font-medium mb-1">{translate("callUs")}</p>
                    <p className="text-white font-semibold text-base lg:text-lg">
                      +91 7987090461
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-sm text-blue-100">
                      <Clock className="w-3 h-3" />
                      <span>Mon-Fri 9AM-6PM IST</span>
                    </div>
                    {copied === '+91 7987090461' && (
                      <motion.span 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-green-300 text-xs font-medium flex items-center gap-1 mt-2"
                      >
                        <CheckCircle className="w-3 h-3" />
                        {translate("copied")}
                      </motion.span>
                    )}
                  </div>
                </motion.div>

                {/* WhatsApp */}
                <motion.div 
                  variants={itemVariants}
                  className="flex items-start gap-4 group cursor-pointer p-4 rounded-xl hover:bg-white/5 transition-all"
                  whileHover={{ x: 8 }}
                  onClick={() => window.open('https://wa.me/917987090461', '_blank')}
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-all backdrop-blur-sm border border-green-300/20"
                  >
                    <FaWhatsapp className="w-6 h-6 text-green-300" />
                  </motion.div>
                  <div>
                    <p className="text-blue-200 text-sm font-medium mb-1">WhatsApp</p>
                    <p className="text-white font-semibold text-base lg:text-lg">
                      {translate("quickResponse")}
                    </p>
                  </div>
                </motion.div>

                {/* Instagram */}
                <motion.div 
                  variants={itemVariants}
                  className="flex items-start gap-4 group cursor-pointer p-4 rounded-xl hover:bg-white/5 transition-all"
                  whileHover={{ x: 8 }}
                  onClick={() => window.open('https://www.instagram.com/marketmindsresearch/', '_blank')}
                >
                   <motion.div 
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:from-pink-500/30 group-hover:to-purple-500/30 transition-all backdrop-blur-sm border border-pink-300/20"
                  >
                    <FaInstagram className="w-6 h-6 text-pink-300" />
                  </motion.div>
                  <div>
                    <p className="text-blue-200 text-sm font-medium mb-1">Instagram</p>
                    <p className="text-white font-semibold text-base lg:text-lg">
                      @marketmindsresearch
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Contact Form Card */}
            <motion.div
              variants={itemVariants}
              className="order-2 lg:order-2 flex items-center"
            >
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 mx-auto max-w-lg lg:max-w-none w-full border border-gray-100"
              >
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {translate('firstName')}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                        placeholder={translate('firstName')}
                        required
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {translate('lastName')}
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                        placeholder={translate('lastName')}
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {translate('email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                      placeholder="name@company.com"
                      required
                    />
                  </motion.div>

                  {/* Phone Number */}
                  <motion.div variants={itemVariants} className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {translate('phoneNumber')}
                    </label>
                    <div className="flex items-stretch bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 focus-within:bg-white transition-all">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100/50 rounded-l-xl transition-colors border-r border-gray-200"
                        >
                          <ReactCountryFlag
                            countryCode={selectedCountry.label}
                            svg
                            style={{ width: '20px', height: '15px', borderRadius: '2px' }}
                          />
                          <span className="font-semibold text-gray-700 text-sm">
                            {selectedCountry.value}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
                            >
                              <div className="p-2">
                                {countryCodes.map((country) => (
                                  <button
                                    key={country.label}
                                    type="button"
                                    onClick={() => handleCountrySelect(country)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-lg transition-colors text-left"
                                  >
                                    <ReactCountryFlag
                                      countryCode={country.label}
                                      svg
                                      style={{ width: '20px', height: '15px' }}
                                    />
                                    <span className="font-semibold text-gray-900 text-sm">{country.value}</span>
                                    <span className="text-gray-500 text-sm flex-1 truncate">{country.country}</span>
                                    {selectedCountry.label === country.label && (
                                      <CheckCircle className="w-4 h-4 text-blue-600" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          </>
                        )}
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 bg-transparent border-none rounded-r-xl text-gray-900 placeholder-gray-400 focus:outline-none"
                        placeholder={translate('enterPhoneNumber')}
                        maxLength="15"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {translate('message')}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all resize-none"
                      placeholder={translate('tellUsAboutProject')}
                      required
                    />
                  </motion.div>

                  <motion.button
                    variants={itemVariants}
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {translate('sendMessage')}
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Contact;