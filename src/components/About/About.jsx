import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "../../contexts/TranslationContext";
import logo from "../../../public/logo.png"; // Import the logo

export default function About({ isOpen, onClose }) {
  const { translate } = useTranslation();

  const features = [
    {
      icon: <img src={logo} alt="Logo" className="w-6 h-6" />, // Replace icon with logo
      title: translate("expertAnalysisTitle"),
      description: translate("expertAnalysisDesc"),
    },
    {
      icon: <img src={logo} alt="Logo" className="w-6 h-6" />,
      title: translate("marketInsightsTitle"),
      description: translate("marketInsightsDesc"),
    },
    {
      icon: <img src={logo} alt="Logo" className="w-6 h-6" />,
      title: translate("experiencedTeamTitle"),
      description: translate("experiencedTeamDesc"),
    },
  ];

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 30,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Enhanced backdrop with blur */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-slate-900/60 backdrop-blur-md z-[9998]"
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto"
          >
            {/* Enhanced modal with glass morphism */}
            <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-slate-100 to-transparent rounded-full blur-2xl"></div>
              </div>

              {/* Enhanced close button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                onClick={onClose}
                className="absolute top-6 right-6 p-3 hover:bg-gray-100/80 rounded-xl transition-all duration-200 backdrop-blur-sm border border-gray-200/50 z-10"
              >
                <X className="w-5 h-5 text-gray-600" />
              </motion.button>

              <div className="relative p-8 sm:p-12">
                {/* Enhanced header with logo */}
                <motion.div
                  variants={headerVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center mb-12"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring", damping: 15 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-2xl mb-6 shadow-lg"
                  >
                    <img
                      src={logo}
                      alt="MarketMinds Logo"
                      className="w-12 h-12"
                    />{" "}
                    {/* Use logo */}
                  </motion.div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-slate-800 bg-clip-text text-transparent mb-3">
                    {translate("aboutTitle")}
                  </h2>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-4"
                  ></motion.div>
                  <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                    {translate("aboutSubtitle")}
                  </p>
                </motion.div>

                {/* Enhanced content sections */}
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-8"
                >
                  <motion.div
                    variants={itemVariants}
                    className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl p-8 border border-gray-200/50 shadow-sm"
                  >
                    <p className="text-gray-700 text-lg leading-relaxed text-center">
                      {translate("aboutFirstParagraph")}
                    </p>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="bg-gradient-to-br from-blue-50/30 to-slate-50 rounded-2xl p-8 border border-blue-200/30 shadow-sm"
                  >
                    <p className="text-gray-700 text-lg leading-relaxed text-center">
                      {translate("aboutSecondParagraph")}
                    </p>
                  </motion.div>

                  {/* Enhanced features grid */}
                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12"
                  >
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        variants={featureVariants}
                        whileHover="hover"
                        className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {/* Hover glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="relative flex flex-col items-center text-center">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="text-blue-600 mb-4 p-3 bg-blue-50 rounded-xl"
                          >
                            {feature.icon}
                          </motion.div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
