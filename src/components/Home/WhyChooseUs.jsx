import React from "react";
import { motion } from "framer-motion";
import { BarChart3, Shield, TrendingUp, Star } from "lucide-react";

const WhyChooseUs = () => {
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

  const features = [
    {
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135706.png",
      title: "Financial Analysis",
      description: "Comprehensive financial modeling, ratio analysis, and performance metrics to drive informed decisions."
    },
    {
      image: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png",
      title: "SWOT Analysis", 
      description: "Detailed strengths, weaknesses, opportunities, and threats assessment for strategic planning."
    },
    {
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      title: "Future Projections",
      description: "Data-driven forecasts and scenario planning backed by industry expertise and market intelligence."
    }
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-blue-50/50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full blur-2xl opacity-20" />
        <div className="absolute bottom-20 left-10 w-40 h-40 sm:w-56 sm:h-56 bg-gradient-to-br from-purple-100 to-blue-200 rounded-full blur-2xl opacity-15" />
      </div>

      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-full text-blue-700 text-sm font-medium shadow-sm mb-6">
              <Star size={16} className="text-blue-500" />
              <span>Why Choose Our Reports?</span>
            </div>
          </motion.div>
          
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4"
          >
            Comprehensive Business Intelligence
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              You Can Trust
            </span>
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Each report is meticulously crafted with years of industry expertise and cutting-edge analytical methodologies to deliver actionable insights.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-gradient-to-br from-blue-50 to-blue-100 p-8 sm:p-10 rounded-3xl shadow-md hover:shadow-lg border border-slate-200 transition-all duration-300 flex flex-col justify-between"
            >
              {/* 3D Image Container */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-2xl shadow-md flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain filter drop-shadow-md"
                    />
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>

              {/* Align Learn More Button to Bottom Center */}
              <div className="mt-6 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-6 py-2.5 bg-white/70 hover:bg-white text-slate-700 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/30"
                >
                  Learn more
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
