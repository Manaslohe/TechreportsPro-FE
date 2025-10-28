import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PlanSelection() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 355,
      period: 'month',
      duration: 1,
      popular: false,
      gradient: 'from-blue-500 to-blue-600',
      totalReports: 7,
      premiumReports: 6,
      bluechipReports: 1,
      features: [
        'Access to 7 premium reports',
        '6 Premium + 1 Bluechip report',
        'Email support',
        'Valid for 1 month'
      ]
    },
    {
      id: 'plus',
      name: 'Plus',
      price: 855,
      period: '3 months',
      duration: 3,
      popular: false,
      gradient: 'from-blue-600 to-blue-700',
      totalReports: 21,
      premiumReports: 18,
      bluechipReports: 3,
      features: [
        'Access to 21 premium reports',
        '18 Premium + 3 Bluechip reports',
        'Priority email support',
        'Valid for 3 months'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 1255,
      period: '6 months',
      duration: 6,
      popular: true,
      gradient: 'from-blue-700 to-blue-800',
      totalReports: 42,
      premiumReports: 36,
      bluechipReports: 6,
      features: [
        'Access to 42 premium reports',
        '36 Premium + 6 Bluechip reports',
        'Priority support',
        'Sector analysis reports',
        'Valid for 6 months'
      ]
    },
    {
      id: 'elite',
      name: 'Elite',
      price: 2555,
      period: 'yearly',
      duration: 12,
      popular: false,
      gradient: 'from-blue-800 to-blue-900',
      badge: 'Best Value',
      totalReports: 84,
      premiumReports: 72,
      bluechipReports: 12,
      features: [
        'Access to 84 premium reports',
        '72 Premium + 12 Bluechip reports',
        'Priority support',
        'Sector analysis reports',
        'Exclusive market insights',
        'Valid for 12 months'
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
              <span>Choose Your Plan</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Select Your Investment Plan
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              Pick the perfect plan for your investment journey
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
                      <span>Most Popular</span>
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
                <div className={`bg-gradient-to-r ${plan.gradient} rounded-t-2xl p-6 text-white`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-bold">₹{plan.price}</span>
                  </div>
                  <p className="text-sm opacity-90">/{plan.period}</p>
                </div>

                {/* Plan Body */}
                <div className="p-6">
                  <div className="mb-4 text-center py-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{plan.totalReports}</p>
                    <p className="text-xs text-gray-600">Total Reports</p>
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
                      {selectedPlan.name} Plan Selected
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <span className="font-semibold text-blue-600 text-lg">₹{selectedPlan.price}</span>
                    <span>•</span>
                    <span>{selectedPlan.period}</span>
                    <span>•</span>
                    <span>{selectedPlan.totalReports} reports</span>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handleProceedToPayment}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <span>Proceed to Payment</span>
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
              👆 Select a plan above to continue
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
