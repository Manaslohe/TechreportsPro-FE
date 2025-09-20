import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Shield, TrendingUp, FileText, ChevronRight, ArrowUpRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../contexts/TranslationContext";

const WhyChooseUs = () => {
  const navigate = useNavigate();
  const { translate } = useTranslation();
  const [activeReport, setActiveReport] = useState(null);
  const [activePreview, setActivePreview] = useState(null);

  const handleLearnMore = (featureId) => {
    setActiveReport(activeReport === featureId ? null : featureId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
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

  const features = [
    {
      id: 1,
      iconBackground: "bg-gradient-to-br from-blue-400 to-blue-600",
      icon: (
        <motion.div 
          variants={iconAnimation} 
          whileHover="hover" 
          className="relative flex items-center justify-center"
        >
          <div className="absolute w-full h-full bg-blue-400 rounded-full opacity-20 animate-ping"></div>
          <BarChart3 className="w-8 h-8 text-white z-10" />
          <motion.div 
            className="absolute w-10 h-10 border-t-2 border-r-2 border-white/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          ></motion.div>
        </motion.div>
      ),
      title: translate("financialAnalysis"),
      description: translate("financialAnalysisDescription"),
      teaser: {
        title: translate("teslaFinancialSnapshot"),
        content: [
          translate("teslaRevenue"),
          translate("teslaOperatingMargin"),
          translate("teslaDebtToEquity"),
          translate("teslaQuickRatio")
        ],
        image: "/financial-chart.png"
      }
    },
    {
      id: 2,
      iconBackground: "bg-gradient-to-br from-purple-400 to-indigo-600",
      icon: (
        <motion.div 
          variants={iconAnimation} 
          whileHover="hover"
          className="relative flex items-center justify-center"
        >
          <div className="absolute w-full h-full bg-purple-400 rounded-full opacity-20 animate-ping" style={{ animationDuration: '3s' }}></div>
          <Shield className="w-8 h-8 text-white z-10" />
          <motion.div 
            className="absolute w-12 h-12 border-2 border-white/20 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
        </motion.div>
      ),
      title: translate("swotAnalysis"),
      description: translate("swotAnalysisDescription"),
      teaser: {
        title: translate("amazonSwotAnalysis"),
        content: [
          translate("amazonStrength"),
          translate("amazonWeakness"),
          translate("amazonOpportunity"),
          translate("amazonThreat")
        ],
        image: "/swot-analysis.png"
      }
    },
    {
      id: 3,
      iconBackground: "bg-gradient-to-br from-green-400 to-teal-500",
      icon: (
        <motion.div 
          variants={iconAnimation} 
          whileHover="hover"
          className="relative flex items-center justify-center"
        >
          <div className="absolute w-full h-full bg-green-400 rounded-full opacity-20 animate-ping" style={{ animationDuration: '4s' }}></div>
          <TrendingUp className="w-8 h-8 text-white z-10" />
          <motion.div 
            className="absolute w-14 h-14 border-b-2 border-l-2 border-white/30 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          ></motion.div>
        </motion.div>
      ),
      title: translate("futureProjections"),
      description: translate("futureProjectionsDescription"),
      teaser: {
        title: translate("appleForecast"),
        content: [
          translate("appleMarketCap"),
          translate("appleWearablesRevenue"),
          translate("appleServicesGrowth"),
          translate("appleAiIntegration")
        ],
        image: "/projection-graph.png"
      }
    }
  ];

  return (
    <section className="relative py-12 sm:py-16 md:py-24 lg:py-36 overflow-hidden bg-gradient-to-b from-indigo-50/40 via-purple-50/30 to-blue-50/40">
      {/* Background image - kept as requested */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/sd.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          opacity: 0.45,
        }}
      />
      
      {/* Unified decorative elements matching other components */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary gradient blobs matching ExpertAnalysis */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        
        {/* Additional seamless gradient elements */}
        <div className="absolute top-1/4 -right-64 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-100/15 rounded-full blur-3xl" />
      </div>

      {/* Improved Floating Safe Box Icon */}
      <div className="absolute top-10 right-10 sm:top-16 sm:right-16 lg:-top-20 lg:right-0 w-20 h-20 sm:w-28 sm:h-28 lg:w-128 lg:h-128">
        <motion.img
          src="/safe box.png"
          alt="Safe Box Icon"
          className="w-full h-full object-contain filter drop-shadow-xl"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 1, 0, -1, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Added subtle glow effect */}
        <div className="absolute inset-0 bg-blue-300/20 rounded-full blur-3xl -z-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20 lg:mb-24"
        >
          <motion.span 
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-transparent bg-clip-text bg-blue-600 text-sm font-semibold">
              {translate("whyChooseUs")}
            </span>
          </motion.span>
          
          <motion.h2 
            className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="block text-slate-900">{translate("expertInsights")}</span>
            <span className="block mt-2 text-transparent bg-clip-text bg-blue-600">
              {translate("strategicDecisions")}
            </span>
          </motion.h2>
          
          <motion.p
            className="mt-6 text-slate-600 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {translate("transformingData")}
          </motion.p>
        </motion.div>

        {/* Improved Features Grid - Mobile Optimized */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              className="group relative backdrop-blur-sm bg-white/90 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100/50 flex flex-col h-full"
            >
              {/* Enhanced Icon Section - Mobile optimized */}
              <div className="mb-4 sm:mb-6 md:mb-8 flex justify-center">
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={iconAnimation}
                  whileHover="hover"
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${feature.iconBackground} rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center relative overflow-hidden`}
                >
                  {/* Subtle background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute -inset-4 opacity-50 bg-white/10 blur"></div>
                    <div className="absolute inset-0 rotate-45 bg-gradient-to-tr from-white/10 to-transparent"></div>
                  </div>
                  
                  <div className="scale-75 sm:scale-90 md:scale-100">
                    {feature.icon}
                  </div>
                </motion.div>
              </div>
              
              {/* Enhanced Feature Content - Mobile optimized */}
              <div className="text-center space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6 md:mb-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                  {feature.title}
                </h3>
                
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Enhanced Button */}
              <div className="mt-auto pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLearnMore(feature.id)}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                    activeReport === feature.id 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" 
                    : "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100"
                  }`}
                >
                  <span>
                    {activeReport === feature.id 
                      ? translate("hideSample") 
                      : translate("viewSample")}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeReport === feature.id ? 'rotate-90' : ''}`} />
                </motion.button>
              </div>

              {/* Enhanced Teaser Section */}
              <AnimatePresence>
                {activeReport === feature.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-6"
                  >
                    <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-xl p-3 sm:p-4 md:p-6 shadow-inner">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <FileText className="text-blue-600 w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800">{feature.teaser.title}</h4>
                      </div>
                      
                      <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 items-center">
                        {/* Enhanced Image Container - Mobile optimized */}
                        <div className="w-full aspect-[4/3] bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm group-hover:shadow transition-all duration-300">
                          <img 
                            src={feature.teaser.image || '/report-placeholder.png'} 
                            alt={`${feature.title} sample`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                              e.target.src = '/report-placeholder.png';
                            }}
                          />
                        </div>
                        
                        {/* Enhanced Bullet Points - Mobile optimized */}
                        <ul className="w-full text-xs sm:text-sm text-slate-700 space-y-2 sm:space-y-3">
                          {feature.teaser.content.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 sm:gap-3 p-1.5 sm:p-2 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span className="font-medium">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-6 text-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate("/catalog")}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          <span>{translate("browseFullReports")}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Decorative corner element */}
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blue-50/50 to-transparent rounded-tl-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/catalog")}
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span>{translate("exploreReports")}</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Enhanced Preview Modal */}
        <AnimatePresence>
          {activePreview !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePreview(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              >
                <div className="relative p-6">
                  <button
                    onClick={() => setActivePreview(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                  
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={features[activePreview]?.teaser.image || '/report-placeholder.png'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/report-placeholder.png';
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default WhyChooseUs;
