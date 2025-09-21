import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, CheckCircle, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-700 to-blue-700 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="min-h-screen flex items-center justify-center py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 xl:gap-16 items-stretch">
            
            {/* Left Column - Contact Information */}
            <motion.div
              variants={leftColumnVariants}
              className="text-white p-8 lg:p-12 order-2 lg:order-1 flex flex-col justify-center"
            >
              <motion.div variants={titleVariants} className="mb-8 lg:mb-12">
                <motion.h1 
                  className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.9 }}
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

              <div className="space-y-6 lg:space-y-8 mb-8 lg:mb-12">
                {/* Email */}
                <motion.div 
                  className="flex items-start gap-4 group cursor-pointer"
                  variants={contactItemVariants}
                  custom={0}
                  whileHover={{ x: 8, transition: { type: "spring", stiffness: 400 } }}
                  onClick={() => handleCopy('techreportspro@gmail.com')}
                >
                  <motion.div 
                    className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all backdrop-blur-sm"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Mail className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-blue-200 text-sm font-medium mb-1">{translate("emailUs")}</p>
                    <p className="text-white font-semibold text-lg">
                      techreportspro@gmail.com
                    </p>
                    {copied === 'techreportspro@gmail.com' && (
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
                  className="flex items-start gap-4 group cursor-pointer"
                  variants={contactItemVariants}
                  custom={1}
                  whileHover={{ x: 8, transition: { type: "spring", stiffness: 400 } }}
                  onClick={() => handleCopy('+91 6264799001')}
                >
                  <motion.div 
                    className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all backdrop-blur-sm"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Phone className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-blue-200 text-sm font-medium mb-1">{translate("callUs")}</p>
                    <p className="text-white font-semibold text-lg">
                      +91 6264799001
                    </p>
                    <p className="text-blue-100 text-sm">{translate("workingHours")}</p>
                    {copied === '+91 6264799001' && (
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
                  className="flex items-start gap-4 group cursor-pointer"
                  variants={contactItemVariants}
                  custom={2}
                  whileHover={{ x: 8, transition: { type: "spring", stiffness: 400 } }}
                  onClick={() => window.open('https://wa.me/916264799001', '_blank')}
                >
                  <motion.div 
                    className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-all backdrop-blur-sm border border-green-300/20"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaWhatsapp className="w-6 h-6 text-green-300" />
                  </motion.div>
                  <div>
                    <p className="text-blue-200 text-sm font-medium mb-1">{translate("connectOn")}</p>
                    <p className="text-white font-semibold text-lg">
                      WhatsApp
                    </p>
                    <p className="text-blue-100 text-sm">{translate("quickResponse")}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Contact Form Card */}
            <motion.div
              variants={formVariants}
              className="order-1 lg:order-2 flex items-center"
            >
              <motion.div 
                className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 mx-auto max-w-lg lg:max-w-none w-full border border-gray-100"
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <motion.div
                      variants={formFieldVariants}
                      custom={0}
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:border-gray-300"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:border-gray-300"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:border-gray-300"
                      placeholder="name@company.com"
                      required
                    />
                  </motion.div>

                  {/* Phone Number with separated country code */}
                  <motion.div
                    variants={formFieldVariants}
                    custom={3}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone number
                    </label>
                    <div className="flex gap-2">
                      <div className="flex items-center px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-semibold min-w-[70px] justify-center">
                        +91
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:border-gray-300"
                        placeholder="1234567890"
                        maxLength="10"
                        pattern="[0-9]{10}"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={formFieldVariants}
                    custom={4}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none hover:border-gray-300"
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
                    className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <motion.div 
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
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
                          <Send className="w-4 h-4" />
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

      {/* Toast Notification */}
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-lg ${
            toast.type === 'success' 
              ? 'bg-green-500/90 text-white' 
              : 'bg-red-500/90 text-white'
          }`}>
            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
            <span className="font-medium">{translate(toast.message)}</span>
            <button 
              onClick={() => setToast({ ...toast, show: false })}
              className="ml-2 hover:opacity-70 text-xl leading-none"
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