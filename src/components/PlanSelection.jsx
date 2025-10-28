import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../contexts/TranslationContext';

export default function PlanSelection() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();
  const { translate } = useTranslation();

  const plans = [
    {
      id: 'basic',
      name: translate('planBasic'),
      price: 355,
      displayPrice: translate('priceBasic'),
      period: translate('planPeriodMonth').replace('/', ''),
      duration: 1,
      popular: false,
      bgColor: 'bg-blue-500',
      totalReports: translate('number7'),
      premiumReports: translate('number6'),
      bluechipReports: translate('number1'),
      features: [
        `${translate('accessTo')} ${translate('number7')} ${translate('premiumReports')}`,
        `${translate('number6')} ${translate('premium')} + ${translate('number1')} ${translate('bluechip')}`,
        translate('emailSupport'),
        `${translate('validFor')} ${translate('planDuration1m')}`
      ]
    },
    {
      id: 'plus',
      name: translate('planPlus'),
      price: 855,
      displayPrice: translate('pricePlus'),
      period: translate('planPeriod3m').replace('/', ''),
      duration: 3,
      popular: false,
      bgColor: 'bg-blue-600',
      totalReports: translate('number21'),
      premiumReports: translate('number18'),
      bluechipReports: translate('number3'),
      features: [
        `${translate('accessTo')} ${translate('number21')} ${translate('premiumReports')}`,
        `${translate('number18')} ${translate('premium')} + ${translate('number3')} ${translate('bluechip')}`,
        translate('priorityEmailSupport'),
        `${translate('validFor')} ${translate('planDuration3m')}`
      ]
    },
    {
      id: 'pro',
      name: translate('planPro'),
      price: 1255,
      displayPrice: translate('pricePro'),
      period: translate('planPeriod6m').replace('/', ''),
      duration: 6,
      popular: true,
      bgColor: 'bg-blue-700',
      totalReports: translate('number42'),
      premiumReports: translate('number36'),
      bluechipReports: translate('number6'),
      features: [
        `${translate('accessTo')} ${translate('number42')} ${translate('premiumReports')}`,
        `${translate('number36')} ${translate('premium')} + ${translate('number6')} ${translate('bluechip')}`,
        translate('prioritySupport'),
        translate('sectorAnalysisReports'),
        `${translate('validFor')} ${translate('planDuration6m')}`
      ]
    },
    {
      id: 'elite',
      name: translate('planElite'),
      price: 2555,
      displayPrice: translate('priceElite'),
      period: translate('planPeriod12m').replace('/', ''),
      duration: 12,
      popular: false,
      bgColor: 'bg-blue-800',
      badge: translate('planBestValue'),
      totalReports: translate('number84'),
      premiumReports: translate('number72'),
      bluechipReports: translate('number12'),
      features: [
        `${translate('accessTo')} ${translate('number84')} ${translate('premiumReports')}`,
        `${translate('number72')} ${translate('premium')} + ${translate('number12')} ${translate('bluechip')}`,
        translate('prioritySupport'),
        translate('sectorAnalysisReports'),
        translate('exclusiveMarketInsights'),
        `${translate('validFor')} ${translate('planDuration12m')}`
      ]
    }
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleProceedToPayment = () => {
    if (selectedPlan) {
      navigate(`/payment/plan/${selectedPlan.id}`, { 
        state: { plan: selectedPlan } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header Section with proper spacing */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>{translate('chooseYour')} {translate('planBasic')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {translate('selectYourPlan')}
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              {translate('pickPerfectPlan')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handlePlanSelect(plan)}
              className="relative cursor-pointer"
            >
              <div 
                className={`h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                  plan.popular ? 'ring-2 ring-blue-500 lg:scale-105' : ''
                } ${
                  selectedPlan?.id === plan.id ? 'ring-4 ring-green-500 shadow-2xl' : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{translate('mostPopular')}</span>
                    </div>
                  </div>
                )}
                
                {/* Best Value Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 right-4 z-10">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {plan.badge}
                    </div>
                  </div>
                )}

                {/* Selected Indicator */}
                {selectedPlan?.id === plan.id && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-green-500 rounded-full p-1">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className={`${plan.bgColor} rounded-t-2xl p-6 text-white`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-bold">{plan.displayPrice}</span>
                  </div>
                  <p className="text-sm opacity-90">/{plan.period}</p>
                </div>

                {/* Plan Body */}
                <div className="p-6">
                  <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="text-center mb-3">
                      <p className="text-3xl font-bold text-blue-600">{plan.totalReports}</p>
                      <p className="text-xs text-gray-600 font-medium">{translate('totalReports')}</p>
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

                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected Plan Summary & Payment Button - Mobile Optimized */}
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky bottom-0 left-0 right-0 bg-white border-t-4 border-green-500 rounded-t-2xl shadow-2xl p-4 sm:p-6 z-20"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Plan Summary */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-green-500 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      {selectedPlan.name} {translate('planSelected')}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <span className="font-semibold text-blue-600 text-lg">{selectedPlan.displayPrice}</span>
                    <span>•</span>
                    <span>{selectedPlan.period}</span>
                    <span>•</span>
                    <span>{selectedPlan.totalReports} {translate('totalReports').toLowerCase()}</span>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handleProceedToPayment}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <span>{translate('proceedToPayment')}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* No Selection Message */}
        {!selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-gray-500 text-sm sm:text-base">
              {translate('selectPlanAbove')}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
