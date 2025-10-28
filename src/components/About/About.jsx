import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, TrendingUp, Users } from "lucide-react";
import { useTranslation } from "../../contexts/TranslationContext";
import logo from "../../../public/logo.png";

export default function About({ isOpen, onClose }) {
  const { translate } = useTranslation();

  const features = [
    {
      icon: <Award className="w-6 h-6" />,
      title: translate("expertAnalysisTitle"),
      description: translate("expertAnalysisDesc"),
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: translate("marketInsightsTitle"),
      description: translate("marketInsightsDesc"),
    },
    {
      icon: <Users className="w-6 h-6" />,
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
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Modal Container */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto border border-gray-100">
              {/* Decorative Background Elements */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-blue-50/40 to-indigo-50/40 rounded-full blur-3xl" />
              </div>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl transition-all z-10 group"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
              </motion.button>

              <div className="relative p-6 sm:p-8 lg:p-12">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="text-center mb-10"
                >
                  {/* Logo */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", damping: 20 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl mb-6 shadow-lg border-2 border-blue-100"
                  >
                    <img
                      src={logo}
                      alt="MarketMinds Logo"
                      className="w-12 h-12"
                    />
                  </motion.div>

                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                    {translate("aboutTitle")}
                  </h2>

                  {/* Decorative Line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-4"
                  />

                  {/* Subtitle */}
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                    {translate("aboutSubtitle")}
                  </p>
                </motion.div>

                {/* Content */}
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* First Paragraph */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-xl p-6 sm:p-8 border border-blue-100/50"
                  >
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed text-center">
                      {translate("aboutFirstParagraph")}
                    </p>
                  </motion.div>

                  {/* Second Paragraph */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-gradient-to-br from-indigo-50/30 to-blue-50/50 rounded-xl p-6 sm:p-8 border border-indigo-100/50"
                  >
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed text-center">
                      {translate("aboutSecondParagraph")}
                    </p>
                  </motion.div>

                  {/* Features Grid */}
                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8"
                  >
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        variants={featureVariants}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="group bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex flex-col items-center text-center">
                          {/* Icon */}
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                            className="mb-4 p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-md group-hover:shadow-lg transition-shadow"
                          >
                            {feature.icon}
                          </motion.div>

                          {/* Title */}
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {feature.title}
                          </h3>

                          {/* Description */}
                          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
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
