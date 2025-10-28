import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Gift, CheckCircle, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

const PaymentChoiceModal = ({ 
  isOpen, 
  onClose, 
  reportTitle, 
  availableReports, 
  onUseSubscription, 
  onPayIndividually,
  loading 
}) => {
  const { translate } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(null);

  const handleConfirm = () => {
    if (selectedOption === 'subscription') {
      onUseSubscription();
    } else if (selectedOption === 'individual') {
      onPayIndividually();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">{translate('choosePaymentMethod')}</h2>
            </div>
            <p className="text-blue-100 text-sm">
              {translate('youHaveActiveSubscription', { 
                count: availableReports.total,
                plural: availableReports.total !== 1 ? 's' : ''
              })}
            </p>
          </div>

          {/* Report Info */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">{translate('selectedReport')}</p>
                <h3 className="font-semibold text-gray-900 line-clamp-2">{reportTitle}</h3>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="p-6 space-y-4">
            {/* Subscription Option */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedOption('subscription')}
              className={`relative cursor-pointer rounded-xl border-2 transition-all ${
                selectedOption === 'subscription'
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${
                      selectedOption === 'subscription' ? 'bg-blue-500' : 'bg-blue-100'
                    }`}>
                      <Gift className={`w-6 h-6 ${
                        selectedOption === 'subscription' ? 'text-white' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        {translate('useSubscription')}
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {translate('free')}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-500">{translate('accessInstantly')}</p>
                    </div>
                  </div>
                  {selectedOption === 'subscription' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="p-1 bg-blue-500 rounded-full"
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </div>

                <div className="space-y-3 pl-14">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Zap className="w-4 h-4 text-green-500" />
                    <span>{translate('instantAccessToReport')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{translate('premiumReportsRemaining', { count: availableReports.premium })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    <span>{translate('bluechipReportsRemaining', { count: availableReports.bluechip })}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-medium">
                    {translate('noAdditionalPayment')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Individual Payment Option */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedOption('individual')}
              className={`relative cursor-pointer rounded-xl border-2 transition-all ${
                selectedOption === 'individual'
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${
                      selectedOption === 'individual' ? 'bg-blue-500' : 'bg-orange-100'
                    }`}>
                      <CreditCard className={`w-6 h-6 ${
                        selectedOption === 'individual' ? 'text-white' : 'text-orange-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {translate('payIndividually')}
                      </h3>
                      <p className="text-sm text-gray-500">{translate('oneTimePurchaseReport')}</p>
                    </div>
                  </div>
                  {selectedOption === 'individual' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="p-1 bg-blue-500 rounded-full"
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </div>

                <div className="space-y-3 pl-14">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span>{translate('saveSubscriptionReports')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span>{translate('permanentAccess')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span>{translate('upiPaymentAccepted')}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-orange-700 font-medium">
                      {translate('amountToPay')}
                    </p>
                    <p className="text-lg font-bold text-orange-700">₹555</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3 rounded-b-2xl">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
            >
              {translate('cancel')}
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedOption || loading}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                selectedOption
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{translate('processing')}</span>
                </>
              ) : (
                <>
                  <span>
                    {selectedOption === 'subscription' ? translate('getReportNow') : translate('proceedToPayment')}
                  </span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentChoiceModal;
