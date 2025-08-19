import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, TrendingUp, Users } from "lucide-react";

export default function About({ isOpen, onClose }) {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Expert Analysis",
      description: "Detailed investment theses and market reports.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Market Insights",
      description: "Actionable strategies from complex trends.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Experienced Team",
      description: "Over a decade of combined market expertise.",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full-screen blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[9998]"
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto"
          >
            {/* Modal content */}
            <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </motion.button>

              <div className="p-6 sm:p-8">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    About Us
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Delivering clarity and value in the world of investing.
                  </p>
                </motion.div>

                {/* Main content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <p className="text-gray-600 text-center leading-relaxed">
                    Our team brings together over a decade of stock market
                    experience with fresh financial insight, combining proven
                    expertise and sharp analytical perspectives. With a strong
                    foundation in equities, trading, and financial research, we
                    specialize in breaking down complex market trends into clear,
                    actionable strategies.
                  </p>
                  <p className="text-gray-600 text-center leading-relaxed">
                    We provide detailed investment theses, comprehensive study
                    reports, in-depth stock analysis, and market insights—all
                    designed to help investors make informed and confident
                    decisions. By blending disciplined market experience with
                    modern financial thinking, we strive to deliver lasting value
                    and clarity in the world of investing.
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex flex-col items-center text-center bg-blue-50 p-4 rounded-lg"
                      >
                        <div className="text-blue-600 mb-2">{feature.icon}</div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {feature.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
