import React from "react";
import { motion } from "framer-motion";
import { Shield, Info, AlertTriangle } from "lucide-react";
import { useTranslation } from "../../contexts/TranslationContext";
import { formatDateHi } from "../../contexts/translations";
import logo from "../../../public/logo.png"; // Import the logo

const Footer = () => {
  const { translate, language } = useTranslation();

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const now = new Date();
  const yearText = language === "hi" ? formatDateHi(now, { year: "numeric" }) : String(now.getFullYear());

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-purple-500/20"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
                <img src={logo} alt="MarketMinds Logo" className="w-8 h-8" /> {/* Use logo */}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">MarketMinds</h3>
                <p className="text-sm text-blue-200">{translate("investmentInsights")}</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {translate("professionalMarketIntelligence")}
            </p>
          </motion.div>

          {/* Important Disclaimer */}
          <motion.div variants={itemVariants} className="lg:col-span-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center mt-0.5">
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    {translate("importantDisclaimer")}
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </h4>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>{translate("disclaimerEducationalPurpose")}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>{translate("notRegisteredWithSEBI")}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>{translate("noInvestmentAdvice")}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>{translate("userResponsibility")}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-red-400">{translate("liability")}:</span> {translate("liabilityDescription")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-slate-700/50"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-slate-400">
                © {yearText} MarketMinds Research. {translate("allRightsReserved")}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {translate("workingHours")}
              </p>
            </div>
            
            {/* Privacy Policy Link */}
            <div className="text-center sm:text-right">
              <a 
                href="/privacy-policy" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300 underline"
              >
                {translate("privacyPolicyTitle")}
              </a>
              <p className="text-xs text-slate-500 mt-1">
                {translate("privacyPolicySubtitle")}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Subtle Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </footer>
  );
};

export default Footer;
