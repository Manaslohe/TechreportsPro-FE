import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FileText, ChevronRight, Sparkles, TrendingUp, BarChart3, Users } from "lucide-react";
import Header from "./Header";

const HomePage = () => {
  const navigate = useNavigate();

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

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 1, 0, -1, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 relative overflow-hidden">
      <Header handleNavigation={navigate} />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orbs */}
        <div className="absolute -top-40 -right-32 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/3 -left-32 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-br from-purple-200 to-blue-300 rounded-full blur-3xl opacity-15" />
        <div className="absolute bottom-20 right-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full blur-2xl opacity-10" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_2px,transparent_2px),linear-gradient(to_bottom,#8080800a_2px,transparent_2px)] bg-[size:30px_30px]" />
        
        {/* Floating Elements */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-1/4 right-1/4 hidden lg:block"
        >
          <div className="w-4 h-4 bg-blue-400 rounded-full opacity-60" />
        </motion.div>
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "2s" }}
          className="absolute top-3/4 left-1/4 hidden lg:block"
        >
          <div className="w-3 h-3 bg-indigo-400 rounded-full opacity-40" />
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-32">
        <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center"
          >
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Main Heading */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                  Transform your
                  <span className="block pb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                    business insights
                  </span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants}>
                <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Unlock critical business intelligence with our meticulously researched PDF reports on leading
companies. Designed for clarity, simplicity, and actionable insights.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                        onClick={() => navigate("/reports")}
                        className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
                        >
                        <span>View All Reports</span>
                        <ChevronRight className="w-5 h-5 transition-transform duration-300" />
                        </button>
                        
                  <button
                    onClick={() => navigate("/custom")}
                    className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/70 hover:scale-[1.02] border border-slate-200 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <span>Get Custom Analysis</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>

              {/* Badge */}
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-full text-blue-700 text-sm font-medium shadow-sm mt-4">
                  <Sparkles size={16} className="text-blue-500" />
                  <span>All reports are priced at ₹300.</span>
                </div>
              </motion.div>
            </div>

            {/* Right Illustration/Visual */}
            <motion.div
              variants={itemVariants}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Main Image Container */}
                <div className="relative z-10">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    src="/hero.png"
                    alt="Business Intelligence Dashboard"
                    className="w-full max-w-lg xl:max-w-xl mx-auto drop-shadow-2xl relative z-10"
                  />
                </div>

                {/* Floating Cards */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute -left-4 top-1/4 hidden sm:block"
                >
                  <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Revenue Growth</div>
                        <div className="text-xs text-slate-600">+32% this quarter</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute -right-4 top-2/3 hidden sm:block"
                >
                  <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Market Analysis</div>
                        <div className="text-xs text-slate-600">Deep insights</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 hidden md:block"
                >
                  <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Expert Team</div>
                        <div className="text-xs text-slate-600">Industry specialists</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl transform scale-150 -z-10" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;