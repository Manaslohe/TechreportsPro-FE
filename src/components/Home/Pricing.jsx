import { useState, useEffect, useRef } from 'react';
import { Check, Star, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../../contexts/TranslationContext';

export default function Pricing() {
  const navigate = useNavigate();
  const { translate } = useTranslation();

  const plans = [
    {
      name: translate('planBasic'),
      price: translate('priceBasic'),
      period: translate('planPeriodMonth'),
      popular: false,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500',
      delay: 0,
      totalReports: translate('number7'),
      premiumReports: translate('number6'),
      bluechipReports: translate('number1'),
      duration: translate('planDuration1m')
    },
    {
      name: translate('planPlus'),
      price: translate('pricePlus'),
      period: translate('planPeriod3m'),
      popular: false,
      gradient: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-600',
      delay: 100,
      totalReports: translate('number21'),
      premiumReports: translate('number18'),
      bluechipReports: translate('number3'),
      duration: translate('planDuration3m')
    },
    {
      name: translate('planPro'),
      price: translate('pricePro'),
      period: translate('planPeriod6m'),
      popular: true,
      gradient: 'from-blue-700 to-blue-800',
      bgColor: 'bg-blue-700',
      delay: 200,
      totalReports: translate('number42'),
      premiumReports: translate('number36'),
      bluechipReports: translate('number6'),
      duration: translate('planDuration6m')
    },
    {
      name: translate('planElite'),
      price: translate('priceElite'),
      period: translate('planPeriod12m'),
      popular: false,
      gradient: 'from-blue-800 to-blue-900',
      bgColor: 'bg-blue-800',
      delay: 300,
      badge: translate('planBestValue'),
      totalReports: translate('number84'),
      premiumReports: translate('number72'),
      bluechipReports: translate('number12'),
      duration: translate('planDuration12m')
    }
  ];

  const features = [
    translate('featurePremiumMarketAnalysis'),
    translate('featureExpertStockRecommendations'),
    translate('featureWeeklyReportUpdates'),
    translate('featureRiskAssessmentReports'),
    translate('featureSectorAnalysis'),
    translate('featurePortfolioGuidance')
  ];

  // Animation variants - Slowed down
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.15
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
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
      className="py-20 bg-gray-50 relative overflow-hidden"
    >
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-100 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border-2 border-blue-100">
            <TrendingUp className="w-4 h-4" />
            <span>{translate('subscriptionsPricing')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            {translate('chooseYour')}
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6">
            {translate('investmentJourney')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {translate('pricingSubtitle')}
          </p>
        </motion.div>

        {/* Subscription Plans */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              onClick={() => navigate('/plans')} // Navigate to PlanSelection page
            >
              <div className={`relative h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${plan.popular ? 'border-blue-500' : 'border-gray-100'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-1 shadow-lg">
                      <Star className="w-4 h-4 fill-current" />
                      <span className='text-nowrap'>{translate('mostPopular')}</span>
                    </div>
                  </div>
                )}
                
                {plan.badge && (
                  <div className="absolute -top-4 right-4">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className={`${plan.bgColor} rounded-t-2xl p-6 text-white`}>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm opacity-80 ml-1">{plan.period}</span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Report Counts */}
                  <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="text-center mb-3">
                      <div className="text-3xl font-bold text-blue-600">{plan.totalReports}</div>
                      <div className="text-xs text-gray-600 font-medium">{translate('totalReports')}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center p-2 bg-white rounded-lg">
                        <div className="font-bold text-blue-600">{plan.premiumReports}</div>
                        <div className="text-gray-600">{translate('premium')}</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg">
                        <div className="font-bold text-purple-600">{plan.bluechipReports}</div>
                        <div className="text-gray-600">{translate('bluechip')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Duration Badge */}
                  <div className="text-center py-2 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-xs font-semibold text-gray-700">{translate('validFor')} {plan.duration}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Universal Buy Plans Button */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <button 
            onClick={() => navigate('/plans')}
            className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {translate('viewSelectPlans')}
          </button>
        </motion.div>

        {/* Individual Report Section */}
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 border-2 border-gray-200">
                  <Calendar className="w-4 h-4" />
                  <span>{translate('oneTimePurchase')}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {translate('individualReport')}
                </h3>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {translate('individualReportDesc')}
                </p>
                <ul className="space-y-4">
                  {[translate('featureComprehensiveStockAnalysis'), translate('featureMarketTrendInsights'), translate('featureRiskAssessment')].map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600 hover:bg-blue-700 rounded-3xl p-8 text-white transform hover:scale-105 transition-all duration-300 shadow-xl">
                  <div className="text-5xl font-bold mb-2">{translate('priceIndividual')}</div>
                  <div className="text-xl opacity-90 mb-6">{translate('perReport')}</div>
                  <button 
                    onClick={() => navigate('/catalog')} // Navigate to catalog for individual reports
                    className="w-full bg-white text-blue-700 py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors duration-300 shadow-lg"
                  >
                    {translate('browseReports')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Schedule Notice */}
        <motion.div variants={itemVariants} className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-full border-2 border-blue-100">
            <Calendar className="w-5 h-5" />
            <span className="font-semibold">
              {translate('reportsUploadedWeekly')}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
