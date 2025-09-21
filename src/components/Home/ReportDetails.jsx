import React from "react";
import { motion } from "framer-motion";
import { FileText, BarChart, Activity, Shield, TrendingUp } from "lucide-react";
import { useTranslation } from "../../contexts/TranslationContext";
import { useNavigate } from "react-router-dom";

const ReportDetails = () => {
  const { translate } = useTranslation();
  const navigate = useNavigate();

  const rightDetails = [
    { 
      id: 1,
      icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />, 
      title: translate("executiveSummary"),
      text: translate("executiveSummaryDescription"),
      color: "from-blue-400 to-blue-600"
    },
    { 
      id: 2,
      icon: <BarChart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />, 
      title: translate("financialAnalysis"),
      text: translate("financialAnalysisDescription"),
      color: "from-indigo-400 to-indigo-600"
    },
    { 
      id: 3,
      icon: <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />, 
      title: translate("performanceMetrics"),
      text: translate("performanceMetricsDescription"),
      color: "from-purple-400 to-purple-600"
    },
    { 
      id: 4,
      icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />, 
      title: translate("swotAnalysis"),
      text: translate("swotAnalysisDescription"),
      color: "from-green-400 to-teal-500"
    },
    { 
      id: 5,
      icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />, 
      title: translate("futureProjections"),
      text: translate("futureProjectionsDescription"),
      color: "from-orange-400 to-pink-500"
    }
  ];

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const iconAnimation = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.1,
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 overflow-hidden bg-gradient-to-b from-blue-50/40 via-indigo-50/30 to-slate-50">
      {/* Unified Background Elements matching other components */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary gradient blobs matching ExpertAnalysis and WhyChooseUs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        
        {/* Additional seamless gradient elements */}
        <div className="absolute top-1/4 -right-64 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-100/15 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl lg:max-w-none lg:w-[95%] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative">
        {/* Enhanced What's Included Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={containerVariants}
          className="space-y-8 sm:space-y-12 md:space-y-16"
        >
          <motion.div 
            variants={fadeInUp} 
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold">
                {translate("comprehensiveReports")}
              </span>
            </div>
            
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              {translate("whatsIncluded")}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mt-2">
                {translate("eachReport")}
              </span>
            </h3>
            <p className="mt-6 text-slate-600 text-lg max-w-2xl mx-auto">
              {translate("craftedByExperts")}
            </p>
          </motion.div>
          
          {/* Mobile-Optimized Grid: 2-2-1 layout for mobile, 5-card layout for desktop */}
          <div className="grid-container px-4 sm:px-0">
            {/* Desktop: All 5 cards in one row, Mobile: Hidden (will show in separate sections) */}
            <motion.div 
              variants={containerVariants}
              className="hidden lg:grid lg:grid-cols-5 gap-8 xl:gap-12 mb-8"
            >
              {rightDetails.map((detail, index) => (
                <motion.div
                  key={detail.id}
                  variants={itemVariants}
                  custom={index}
                  whileHover={{ 
                    y: -4, 
                    boxShadow: "0 15px 20px -5px rgba(0, 0, 0, 0.1), 0 8px 8px -5px rgba(0, 0, 0, 0.04)",
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  className="group relative backdrop-blur-sm bg-white/90 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-slate-100/50 overflow-hidden"
                >
                  {/* Enhanced Animated Icon - Desktop */}
                  <div className="mb-6 relative">
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      variants={iconAnimation}
                      whileHover="hover"
                      className={`w-14 h-14 bg-gradient-to-br ${detail.color} rounded-xl shadow-lg flex items-center justify-center`}
                    >
                      {detail.icon}
                      
                      {/* Enhanced animated rings */}
                      <motion.div 
                        className="absolute w-full h-full border border-white/20 rounded-xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                      ></motion.div>
                      
                      <motion.div 
                        className="absolute w-10 h-10 border-2 border-white/10 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      ></motion.div>
                    </motion.div>
                    
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Enhanced Card Content - Desktop */}
                  <div className="space-y-3 relative z-10">
                    <div className="relative">
                      <h4 className="text-xl font-bold text-slate-900 transition-opacity duration-300 group-hover:opacity-0">
                        {detail.title}
                      </h4>
                      <h4 className="absolute inset-0 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {detail.title}
                      </h4>
                    </div>
                    <p className="text-base text-slate-600 leading-relaxed">
                      {detail.text}
                    </p>
                  </div>
                  
                  {/* Enhanced decorative elements */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blue-50/70 to-transparent rounded-tl-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent transform -translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile: First 2 cards */}
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-2 sm:grid-cols-2 lg:hidden gap-4 sm:gap-6 mb-6"
            >
              {rightDetails.slice(0, 2).map((detail, index) => (
                <motion.div
                  key={detail.id}
                  variants={itemVariants}
                  custom={index}
                  whileHover={{ 
                    y: -4, 
                    boxShadow: "0 15px 20px -5px rgba(0, 0, 0, 0.1), 0 8px 8px -5px rgba(0, 0, 0, 0.04)",
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  className="group relative backdrop-blur-sm bg-white/90 p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-slate-100/50 overflow-hidden"
                >
                  {/* Enhanced Animated Icon - Mobile optimized */}
                  <div className="mb-3 sm:mb-4 md:mb-6 relative">
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      variants={iconAnimation}
                      whileHover="hover"
                      className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${detail.color} rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center`}
                    >
                      <div className="scale-75 sm:scale-90 lg:scale-100">
                        {detail.icon}
                      </div>
                      
                      {/* Enhanced animated rings with mobile optimization */}
                      <motion.div 
                        className="absolute w-full h-full border border-white/20 rounded-xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                      ></motion.div>
                      
                      <motion.div 
                        className="absolute w-10 h-10 border-2 border-white/10 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      ></motion.div>
                    </motion.div>
                    
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Enhanced Card Content with Fixed Hover Effect - Mobile optimized */}
                  <div className="space-y-2 sm:space-y-3 relative z-10">
                    <div className="relative">
                      <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-900 transition-opacity duration-300 group-hover:opacity-0">
                        {detail.title}
                      </h4>
                      <h4 className="absolute inset-0 text-sm sm:text-base md:text-lg lg:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {detail.title}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                      {detail.text}
                    </p>
                  </div>
                  
                  {/* Enhanced decorative elements */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blue-50/70 to-transparent rounded-tl-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent transform -translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Mobile: Middle 2 cards */}
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-2 sm:grid-cols-2 lg:hidden gap-4 sm:gap-6 mb-6"
            >
              {rightDetails.slice(2, 4).map((detail, index) => (
                <motion.div
                  key={detail.id}
                  variants={itemVariants}
                  custom={index + 3}
                  whileHover={{ 
                    y: -4, 
                    boxShadow: "0 15px 20px -5px rgba(0, 0, 0, 0.1), 0 8px 8px -5px rgba(0, 0, 0, 0.04)",
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  className="group relative backdrop-blur-sm bg-white/90 p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-slate-100/50 overflow-hidden"
                >
                  {/* Enhanced Animated Icon - Mobile optimized */}
                  <div className="mb-3 sm:mb-4 md:mb-6 relative">
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      variants={iconAnimation}
                      whileHover="hover"
                      className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${detail.color} rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center`}
                    >
                      <div className="scale-75 sm:scale-90 lg:scale-100">
                        {detail.icon}
                      </div>
                      
                      {/* Enhanced animated rings */}
                      <motion.div 
                        className="absolute w-full h-full border border-white/20 rounded-xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                      ></motion.div>
                      
                      <motion.div 
                        className="absolute w-10 h-10 border-2 border-white/10 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      ></motion.div>
                    </motion.div>
                    
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Enhanced Card Content with Fixed Hover Effect - Mobile optimized */}
                  <div className="space-y-2 sm:space-y-3 relative z-10">
                    <div className="relative">
                      <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-900 transition-opacity duration-300 group-hover:opacity-0">
                        {detail.title}
                      </h4>
                      <h4 className="absolute inset-0 text-sm sm:text-base md:text-lg lg:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {detail.title}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                      {detail.text}
                    </p>
                  </div>
                  
                  {/* Enhanced decorative elements */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blue-50/70 to-transparent rounded-tl-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent transform -translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile: Last card centered */}
            <motion.div
              variants={containerVariants}
              className="flex justify-center lg:hidden"
            >
              <motion.div
                variants={itemVariants}
                custom={4}
                whileHover={{ 
                  y: -4, 
                  boxShadow: "0 15px 20px -5px rgba(0, 0, 0, 0.1), 0 8px 8px -5px rgba(0, 0, 0, 0.04)",
                  transition: { type: "spring", stiffness: 400, damping: 17 }
                }}
                className="w-full max-w-[calc(50%-0.5rem)] group relative backdrop-blur-sm bg-white/90 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 border border-slate-100/50 overflow-hidden"
              >
                {/* Enhanced Animated Icon - Mobile optimized */}
                <div className="mb-3 sm:mb-4 relative">
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={iconAnimation}
                    whileHover="hover"
                    className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${rightDetails[4].color} rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center`}
                  >
                    <div className="scale-75 sm:scale-90">
                      {rightDetails[4].icon}
                    </div>
                    
                    {/* Enhanced animated rings */}
                    <motion.div 
                      className="absolute w-full h-full border border-white/20 rounded-xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    ></motion.div>
                    
                    <motion.div 
                      className="absolute w-10 h-10 border-2 border-white/10 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    ></motion.div>
                  </motion.div>
                  
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Enhanced Card Content with Fixed Hover Effect - Mobile optimized */}
                <div className="space-y-2 sm:space-y-3 relative z-10">
                  <div className="relative">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 transition-opacity duration-300 group-hover:opacity-0">
                      {rightDetails[4].title}
                    </h4>
                    <h4 className="absolute inset-0 text-sm sm:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {rightDetails[4].title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {rightDetails[4].text}
                  </p>
                </div>
                
                {/* Enhanced decorative elements */}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blue-50/70 to-transparent rounded-tl-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent transform -translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Call to Action - Enhanced with Animation */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={containerVariants}
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold">
                {translate("readyToDive")}
              </span>
            </motion.div>
            
            <motion.h2 
              variants={fadeInUp} 
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4"
            >
              {translate("unlockPotential")}
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto mb-6"
            >
              {translate("actionableInsights")}
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex justify-center">
              <button
                onClick={() => navigate("/contact")}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <span>{translate("getStarted")}</span>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReportDetails;