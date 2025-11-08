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
            className="w-full flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center"
          >
            {/* Left Content - Enhanced for mobile */}
            <div className="space-y-5 sm:space-y-6 lg:space-y-8 text-center lg:text-left max-w-2xl mx-auto lg:mx-0 order-2 lg:order-1">
              {/* Main Heading - Better mobile spacing */}
              <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-nowrap font-bold text-white leading-tight tracking-tight">
                  {translate('heroTitle')}
                </h1>
              </motion.div>

              {/* Description - Improved mobile readability */}
              <motion.div variants={itemVariants} className="relative">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {translate('heroDescription')}
                </p>
              </motion.div>

              {/* Stats Section - Enhanced mobile design */}
              <motion.div 
                variants={itemVariants} 
                className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-8 py-4 sm:py-5 lg:py-6 border-y border-white/10"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center lg:text-left bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10"
                >
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                    {translate('statsNumber')}
                  </div>
                  <div className="text-blue-200 text-xs sm:text-sm font-medium">
                    {translate('companyReports')}
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center lg:text-left bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10"
                >
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                    {translate('access')}
                  </div>
                  <div className="text-blue-200 text-xs sm:text-sm font-medium">
                    {translate('instantAccess')}
                  </div>
                </motion.div>
              </motion.div>

              {/* Action Buttons - Enhanced mobile layout */}
              <motion.div variants={itemVariants}>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/catalog")}
                    className="group w-full sm:w-auto px-6 sm:px-7 lg:px-8 py-3 sm:py-3.5 lg:py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span className="text-sm sm:text-base">{translate('browseReports')}</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/contact")}
                    className="group w-full sm:w-auto px-6 sm:px-7 lg:px-8 py-3 sm:py-3.5 lg:py-4 bg-blue-700/30 text-white rounded-xl font-semibold backdrop-blur-sm border border-white/10 hover:bg-blue-700/40 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span className="text-sm sm:text-base">{translate('customAnalysis')}</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Price Badge - Enhanced mobile design */}
              <motion.div variants={fadeInUp} className="relative flex justify-center lg:justify-start">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs sm:text-sm font-medium shadow-lg"
                >
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-200 animate-pulse" />
                  <span>{translate('pricingBadge')}</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Illustration - Enhanced mobile positioning */}
            <motion.div
              variants={itemVariants}
              className="relative flex justify-center lg:justify-end order-1 lg:order-2 w-full"
            >
              <div className="relative w-full max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-none">
                {/* Hero Video - Moved up for better positioning */}
                <div className="relative z-10 w-full h-40 sm:h-56 md:h-72 lg:h-80 xl:h-[20rem] 2xl:h-[24rem] group flex justify-center -translate-y-2 sm:-translate-y-12 md:-translate-y-16 lg:-translate-y-10">
                  <motion.img
                    whileHover={{ scale: 0.55, rotate: 1 }}
                    transition={{ duration: 0.3 }}
                    src="/hero.gif"
                    alt="Hero GIF"
                    className="w-[60%] h-[100%] object-cover rounded-xl sm:rounded-2xl slow-gif"
                  />
                </div>

                <style>
                  {`
                    .slow-gif {
                      animation: slowGifPlayback 60s linear infinite; /* Increased duration to 60s */
                    }

                    @keyframes slowGifPlayback {
                      0% { transform: scale(1); }
                      50% { transform: scale(1.05); }
                      100% { transform: scale(1); }
                    }
                  `}
                </style>

                {/* Floating Cards - Keeping original positions relative to container */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute -left-2 sm:-left-3 lg:-left-4 top-1/4 block hover:scale-105 transition-transform duration-300 float-animation"
                  style={{ animationDelay: '0s' }}
                >
                  <div className="bg-white/95 backdrop-blur-sm p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl shadow-lg border border-slate-100/50">
                    <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3">
                      <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm lg:text-base font-semibold text-slate-900 truncate">
                          {translate('revenueGrowth')}
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-600 hidden sm:block">
                          {translate('growthStats')}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute -right-2 sm:-right-3 lg:-right-4 top-2/3 block hover:scale-105 transition-transform duration-300 float-animation"
                  style={{ animationDelay: '2s' }}
                >
                  <div className="bg-white/95 backdrop-blur-sm p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl shadow-lg border border-slate-100/50">
                    <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3">
                      <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm lg:text-base font-semibold text-slate-900 truncate">
                          {translate('marketAnalysis')}
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-600 hidden sm:block">
                          {translate('deepInsights')}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="absolute -bottom-3 sm:-bottom-4 lg:-bottom-6 left-1/2 transform -translate-x-1/2 block hover:scale-105 transition-transform duration-300 float-animation"
                  style={{ animationDelay: '4s' }}
                >
                  <div className="bg-white/95 backdrop-blur-sm p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl shadow-lg border border-slate-100/50">
                    <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3">
                      <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm lg:text-base font-semibold text-slate-900 truncate">
                          {translate('expertTeam')}
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-600 hidden sm:block">
                          {translate('industrySpecialists')}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Background decoration - subtle for mobile */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl sm:blur-3xl transform rotate-6 scale-110"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Down Button - Enhanced mobile design */}
        <motion.div
          variants={scrollDownVariants}
          initial="hidden"
          animate="visible"
          className="hidden sm:flex sm:absolute sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex-col items-center sm:cursor-pointer z-10 pointer-events-none sm:pointer-events-auto"
          onClick={handleScrollDown}
        >
          <motion.div
            variants={bounceAnimation}
            animate="animate"
            className="group flex flex-col items-center space-y-1 sm:space-y-1.5 hover:scale-110 transition-transform duration-300"
          >
            <span className="text-white/80 text-[10px] sm:text-xs font-medium tracking-wide uppercase mb-1 group-hover:text-white transition-colors duration-300">
              {translate('scrollDownText')}
            </span>
            
            <div className="relative">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-2 border-white/30 rounded-full flex items-center justify-center backdrop-blur-sm bg-white/10 group-hover:border-white/60 group-hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 group-hover:text-white transition-colors duration-300" />
              </motion.div>
              
              <div className="absolute inset-0 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-2 border-white/40 rounded-full custom-pulse pointer-events-none"></div>
            </div>
            
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 10 }}
              transition={{ delay: 3, duration: 0.6, ease: "easeOut" }}
              className="w-px bg-gradient-to-b from-white/60 to-transparent hidden sm:block"
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;