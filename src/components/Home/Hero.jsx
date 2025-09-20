import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Sparkles, TrendingUp, BarChart3, Users, ChevronDown } from "lucide-react";
import Header from "./Header";
import { useTranslation } from "../../contexts/TranslationContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { translate } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
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

  const scrollDownVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 2.5, // Appears after hero animations complete
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const bounceAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const handleScrollDown = () => {
    const nextSection = document.getElementById('next-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: scroll down by viewport height
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen max-h-screen relative overflow-hidden bg-[#120ECF]">
      <div
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundBlendMode: 'overlay',
          animation: 'fadeIn 3s ease-in-out'
        }}
        className="absolute inset-0"
      ></div>

      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .float-animation {
            animation: float 6s ease-in-out infinite;
          }
          @keyframes customPulse {
            0% {
              opacity: 0.4;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.1);
            }
            100% {
              opacity: 0.4;
              transform: scale(1);
            }
          }
          .custom-pulse {
            animation: customPulse 2s ease-in-out infinite;
          }
        `}
      </style>
      
      <Header handleNavigation={navigate} />
      
      <section className="relative h-full flex flex-col pt-16 sm:pt-20 lg:pt-24">
        <div className="flex-1 flex items-center max-w-[95%] sm:max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center"
          >
            {/* Left Content */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left max-w-2xl mx-auto lg:mx-0 order-2 lg:order-1">
              {/* Main Heading */}
              <motion.div variants={itemVariants} className="space-y-2 sm:space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-nowrap leading-tight tracking-tight">
                  {translate('heroTitle')}
                </h1>
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants} className="relative">
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-blue-100 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {translate('heroDescription')}
                </p>
              </motion.div>

              {/* Stats Section */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-8 py-3 sm:py-4 lg:py-6 border-y border-white/10">
                <div className="text-center lg:text-left">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">{translate('statsNumber')}</div>
                  <div className="text-blue-200 text-xs sm:text-sm mt-1">{translate('companyReports')}</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">{translate('access')}</div>
                  <div className="text-blue-200 text-xs sm:text-sm mt-1">{translate('instantAccess')}</div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants}>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => navigate("/catalog")}
                    className="group w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span className="text-xs sm:text-sm lg:text-base">{translate('browseReports')}</span>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                  
                  <button
                    onClick={() => navigate("/contact")}
                    className="group w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-blue-700/30 text-white rounded-xl font-semibold backdrop-blur-sm border border-white/10 hover:bg-blue-700/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span className="text-xs sm:text-sm lg:text-base">{translate('customAnalysis')}</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>

              {/* Price Badge */}
              <motion.div variants={fadeInUp} className="relative">
                <div className="inline-flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white text-xs lg:text-sm font-medium">
                  <Sparkles size={12} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-blue-200 animate-pulse" />
                  <span>{translate('pricingBadge')}</span>
                </div>
              </motion.div>
            </div>

            {/* Right Illustration/Visual */}
            <motion.div
              variants={itemVariants}
              className="relative flex justify-center lg:justify-end order-1 lg:order-2 w-full"
            >
              <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-none">
                {/* Hero Image with dynamic height - increased for full visibility */}
                <div className="relative z-10 w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] 2xl:h-[32rem] group">
                  <img
                    src="/hero.png"
                    alt="Business Intelligence Dashboard"
                    className="w-full h-full object-contain rounded-xl sm:rounded-2xl transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1"
                  />
                </div>

                {/* Floating Cards - Responsive positioning */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute -left-1 sm:-left-2 lg:-left-4 top-1/4 block hover:scale-105 hover:shadow-xl transition-transform duration-300 float-animation"
                  style={{ animationDelay: '0s' }}
                >
                  <div className="bg-white/95 backdrop-blur-sm p-1.5 sm:p-2 lg:p-3 xl:p-4 rounded-lg sm:rounded-xl shadow-lg border border-slate-100/50">
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                      <div className="p-1 sm:p-1.5 lg:p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-900">{translate('revenueGrowth')}</div>
                        <div className="text-[8px] sm:text-xs text-slate-600 hidden md:block">{translate('growthStats')}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute -right-1 sm:-right-2 lg:-right-4 top-2/3 block hover:scale-105 hover:shadow-xl transition-transform duration-300 float-animation"
                  style={{ animationDelay: '2s' }}
                >
                  <div className="bg-white/95 backdrop-blur-sm p-1.5 sm:p-2 lg:p-3 xl:p-4 rounded-lg sm:rounded-xl shadow-lg border border-slate-100/50">
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                      <div className="p-1 sm:p-1.5 lg:p-2 bg-blue-100 rounded-lg">
                        <BarChart3 className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-900">{translate('marketAnalysis')}</div>
                        <div className="text-[8px] sm:text-xs text-slate-600 hidden md:block">{translate('deepInsights')}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="absolute -bottom-2 sm:-bottom-3 lg:-bottom-6 left-1/2 transform -translate-x-1/2 block hover:scale-105 hover:shadow-xl transition-transform duration-300 float-animation"
                  style={{ animationDelay: '4s' }}
                >
                  <div className="bg-white/95 backdrop-blur-sm p-1.5 sm:p-2 lg:p-3 xl:p-4 rounded-lg sm:rounded-xl shadow-lg border border-slate-100/50">
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                      <div className="p-1 sm:p-1.5 lg:p-2 bg-purple-100 rounded-lg">
                        <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-900">{translate('expertTeam')}</div>
                        <div className="text-[8px] sm:text-xs text-slate-600 hidden md:block">{translate('industrySpecialists')}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Background decoration */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl transform rotate-6 scale-110 lg:hidden"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Down Button - positioned at bottom */}
        <motion.div
          variants={scrollDownVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
          onClick={handleScrollDown}
        >
          <motion.div
            variants={bounceAnimation}
            animate="animate"
            className="group flex flex-col items-center space-y-1 hover:scale-110 transition-transform duration-300"
          >
            <span className="text-white/80 text-[10px] sm:text-xs font-medium tracking-wide uppercase mb-1 group-hover:text-white transition-colors duration-300">
              {translate('scrollDownText')}
            </span>
            
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-2 border-white/30 rounded-full flex items-center justify-center backdrop-blur-sm bg-white/10 group-hover:border-white/60 group-hover:bg-white/20 transition-all duration-300">
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white/80 group-hover:text-white transition-colors duration-300" />
              </div>
              
              <div className="absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-2 border-white/40 rounded-full custom-pulse pointer-events-none"></div>
            </div>
            
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 12 }}
              transition={{ delay: 3, duration: 0.6, ease: "easeOut" }}
              className="w-px bg-gradient-to-b from-white/60 to-transparent"
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;