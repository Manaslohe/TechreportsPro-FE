import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, BarChart } from "lucide-react";
import { useTranslation } from "../../contexts/TranslationContext";

const ExpertAnalysis = () => {
  const { translate } = useTranslation();

  const leftDetails = [
    translate("industryExperience"),
    translate("companiesAnalyzed"),
    translate("provenFramework")
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

  return (
    <section className="relative py-12 sm:py-16 md:py-24 lg:py-36 overflow-visible bg-gradient-to-b from-indigo-50/40 via-purple-50/30 to-blue-50/40">
      {/* Background image - match WhyChooseUs and extend beyond section */}
      <div
        className="absolute top-0 left-0 right-0 -z-10 pointer-events-none bg-cover bg-center"
        style={{
          height: "160%",
          backgroundImage: "url('/sd.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          opacity: 0.45
        }}
      />
      {/* Soft fade so the background doesn't end abruptly */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 sm:h-28 md:h-32 bg-gradient-to-b from-transparent to-white/90 -z-0"></div>

      {/* Unified decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary gradient blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        
        {/* Additional seamless gradient elements */}
        <div className="absolute top-1/4 -right-64 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-100/15 rounded-full blur-3xl" />
        
        {/* Floating decorative elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute top-20 right-10 lg:top-40 lg:right-20 hidden lg:block"
        >
          <motion.div 
            variants={floatingAnimation}
            initial="initial"
            animate="animate"
            className="w-32 h-32 rounded-full border-2 border-dashed border-blue-300/40 opacity-60"
            style={{ animationDelay: "0s" }}
          ></motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="absolute bottom-20 left-10 lg:bottom-40 lg:left-20 hidden lg:block"
        >
          <motion.div 
            variants={floatingAnimation}
            initial="initial"
            animate="animate"
            className="w-24 h-24 rounded-full border-2 border-dashed border-indigo-300/40 opacity-60"
            style={{ animationDelay: "2s" }}
          ></motion.div>
        </motion.div>

        {/* Coins Background Image - kept as requested */}
        <img
          src="/coins.png"
          alt="Coins Background"
          className="absolute bottom-10 left-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-58 object-cover opacity-90 z-0"
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative">
        {/* Main Content Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-20 items-center"
        >
          {/* Left Content */}
          <motion.div 
            variants={containerVariants}
            className="space-y-4 sm:space-y-6 md:space-y-8 order-2 lg:order-1 text-center lg:text-left"
          >
            {/* Badge text same as WhyChooseUs */}
            <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 justify-center lg:justify-start">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold">
                {translate("whyChooseUs")}
              </span>
            </motion.div>

            {/* Heading same as WhyChooseUs */}
            <motion.h2 
              variants={fadeInUp} 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
            >
              <span className="block text-slate-900">{translate("expertInsights")}</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {translate("strategicDecisions")}
              </span>
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-base sm:text-lg text-slate-600 leading-relaxed"
            >
              {translate("expertAnalysisDescription")}
            </motion.p>
            
            <motion.ul variants={containerVariants} className="space-y-5">
              {leftDetails.map((detail, index) => (
                <motion.li 
                  key={index} 
                  variants={itemVariants}
                  className="flex items-center gap-4"
                >
                  <div className="p-1.5 bg-blue-50 rounded-full">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                  </div>
                  <span className="text-sm sm:text-base text-slate-700 font-medium">{detail}</span>
                </motion.li>
              ))}
            </motion.ul>
            
            <motion.div variants={fadeInUp} className="flex justify-center lg:justify-start pt-4">
              <button className="group inline-flex items-center gap-2 px-6 py-3 text-sm xl:text-lg font-semibold text-white bg-blue-600 rounded-xl hover:shadow-lg transition-all duration-300">
                <span>{translate("learnMoreMethodology")}</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Right Content with Image - overlap next section */}
          <motion.div 
            variants={itemVariants}
            className="relative order-1 lg:order-2 lg:-mb-24 xl:-mb-32"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0.5 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative mx-auto max-w-[280px] sm:max-w-[320px] md:max-w-sm lg:max-w-lg"
            >
              <div className="relative group perspective-1000">
                {/* 3D Interactive Image */}
                <motion.img
                  src="/reprot.png"
                  alt="Interactive Report"
                  className="w-full h-auto transition-transform duration-500 group-hover:rotate-x-6 group-hover:rotate-y-6 group-hover:scale-105"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700"></div>

                {/* Floating card on image - Mobile optimized */}
                <motion.div 
                  variants={floatingAnimation}
                  initial="initial"
                  animate="animate"
                  className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 max-w-[160px] sm:max-w-[200px]"
                >
                  <div className="backdrop-blur-md bg-white/90 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl shadow-lg border border-white/50">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <div className="p-1 sm:p-1.5 bg-blue-100 rounded-lg">
                        <BarChart className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-900">
                        {translate("financialPerformance")}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>{translate("revenueGrowth")}</span>
                      <span className="font-medium text-green-600">
                        {translate("growthPercentage", { value: "+24.8%" })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Background glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl blur-xl opacity-50 -z-10 transform -rotate-6"></div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExpertAnalysis;