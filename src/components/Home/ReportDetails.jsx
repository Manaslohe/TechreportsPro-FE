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
      color: "bg-blue-500"
    },
    { 
      id: 2,
      icon: <BarChart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />, 
      title: translate("financialAnalysis"),
      text: translate("financialAnalysisDescription"),
      color: "bg-indigo-500"
    },
    { 
      id: 3,
      icon: <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />, 
      title: translate("performanceMetrics"),
      text: translate("performanceMetricsDescription"),
      color: "bg-purple-500"
    },
    { 
      id: 4,
      icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />, 
      title: translate("swotAnalysis"),
      text: translate("swotAnalysisDescription"),
      color: "bg-green-500"
    },
    { 
      id: 5,
      icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />, 
      title: translate("futureProjections"),
      text: translate("futureProjectionsDescription"),
      color: "bg-orange-500"
    }
  ];

  // Animation variants - Slowed down and more engaging
  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0.7, opacity: 0, rotate: -10 },
    visible: { 
      scale: 1, 
      opacity: 1,
      rotate: 0,
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
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionVariants}
      className="relative py-8 sm:py-12 md:py-16 lg:py-20 overflow-hidden bg-white"
    >
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-indigo-100 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl lg:max-w-none lg:w-[95%] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative">
        {/* What's Included Section */}
        <motion.div
          variants={sectionVariants}
          className="space-y-8 sm:space-y-12 md:space-y-16"
        >
          <motion.div 
            variants={cardVariants} 
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border-2 border-blue-100 mb-6">
              <span className="text-blue-700 text-sm font-semibold">
                {translate("comprehensiveReports")}
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
              {translate("whatsIncluded")}
            </h3>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600">
              {translate("eachReport")}
            </h3>
            <p className="mt-6 text-slate-600 text-lg max-w-2xl mx-auto">
              {translate("craftedByExperts")}
            </p>
          </motion.div>
          
          {/* Desktop: All 5 cards in one row */}
          <motion.div 
            variants={sectionVariants}
            className="hidden lg:grid lg:grid-cols-5 gap-8 xl:gap-12 mb-8"
          >
            {rightDetails.map((detail, index) => (
              <motion.div
                key={detail.id}
                variants={cardVariants}
                whileHover={{ 
                  y: -6,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="group relative bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200 overflow-hidden"
              >
                {/* Animated Icon */}
                <div className="mb-6 relative">
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={iconVariants}
                    whileHover="hover"
                    className={`w-14 h-14 ${detail.color} rounded-xl shadow-lg flex items-center justify-center`}
                  >
                    {detail.icon}
                  </motion.div>
                </div>
                <div className="space-y-3 relative z-10">
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                    {detail.title}
                  </h4>
                  <p className="text-base text-slate-600 leading-relaxed">
                    {detail.text}
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-50 rounded-tl-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile: 2-2-1 layout */}
          <motion.div 
            variants={sectionVariants}
            className="grid grid-cols-2 sm:grid-cols-2 lg:hidden gap-4 sm:gap-6 mb-6"
          >
            {rightDetails.slice(0, 2).map((detail, index) => (
              <motion.div
                key={detail.id}
                variants={cardVariants}
                whileHover={{ 
                  y: -6,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="group relative bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200 overflow-hidden"
              >
                {/* Animated Icon */}
                <div className="mb-3 sm:mb-4 md:mb-6 relative">
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={iconVariants}
                    whileHover="hover"
                    className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 ${detail.color} rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center`}
                  >
                    <div className="scale-75 sm:scale-90 lg:scale-100">
                      {detail.icon}
                    </div>
                  </motion.div>
                </div>
                <div className="space-y-2 sm:space-y-3 relative z-10">
                  <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                    {detail.title}
                  </h4>
                  <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                    {detail.text}
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-50 rounded-tl-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div 
            variants={sectionVariants}
            className="grid grid-cols-2 sm:grid-cols-2 lg:hidden gap-4 sm:gap-6 mb-6"
          >
            {rightDetails.slice(2, 4).map((detail, index) => (
              <motion.div
                key={detail.id}
                variants={cardVariants}
                whileHover={{ 
                  y: -6,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="group relative bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200 overflow-hidden"
              >
                {/* Animated Icon */}
                <div className="mb-3 sm:mb-4 md:mb-6 relative">
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={iconVariants}
                    whileHover="hover"
                    className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 ${detail.color} rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center`}
                  >
                    <div className="scale-75 sm:scale-90 lg:scale-100">
                      {detail.icon}
                    </div>
                  </motion.div>
                </div>
                <div className="space-y-2 sm:space-y-3 relative z-10">
                  <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                    {detail.title}
                  </h4>
                  <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                    {detail.text}
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-50 rounded-tl-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            variants={sectionVariants}
            className="flex justify-center lg:hidden"
          >
            <motion.div
              variants={cardVariants}
              whileHover={{ 
                y: -6,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="w-full max-w-[calc(50%-0.5rem)] group relative bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200 overflow-hidden"
            >
              {/* Animated Icon */}
              <div className="mb-3 sm:mb-4 relative">
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={iconVariants}
                  whileHover="hover"
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${rightDetails[4].color} rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center`}
                >
                  <div className="scale-75 sm:scale-90">
                    {rightDetails[4].icon}
                  </div>
                </motion.div>
              </div>
              <div className="space-y-2 sm:space-y-3 relative z-10">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                  {rightDetails[4].title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {rightDetails[4].text}
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-50 rounded-tl-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Call to Action */}
        <motion.div 
          variants={cardVariants}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border-2 border-blue-100 mb-4">
            <span className="text-blue-700 text-sm font-semibold">
              {translate("readyToDive")}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            {translate("unlockPotential")}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto mb-6">
            {translate("actionableInsights")}
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span>{translate("getStarted")}</span>
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ReportDetails;