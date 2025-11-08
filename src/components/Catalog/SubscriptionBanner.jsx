import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Crown, Gem, CheckCircle, Info, Clock, ShoppingCart, Calendar } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

const SubscriptionBanner = ({ subscriptionStatus, onDismiss }) => {
  const { translate } = useTranslation();

  if (!subscriptionStatus || !subscriptionStatus.availableReports) {
    return null;
  }

  // Calculate days remaining - Using same logic as Dashboard
  const calculateDaysRemaining = () => {
    // Try multiple possible date fields to match Dashboard structure
    const expiryDate = subscriptionStatus.current?.expiryDate || 
                      subscriptionStatus.endDate || 
                      subscriptionStatus.expiryDate;
    
    if (!expiryDate) return null;
    
    const now = new Date();
    const endDate = new Date(expiryDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Use same formatDate function as Dashboard
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const daysRemaining = calculateDaysRemaining();
  
  // Get the correct expiry date for display
  const expiryDate = subscriptionStatus.current?.expiryDate || 
                    subscriptionStatus.endDate || 
                    subscriptionStatus.expiryDate;

  // Debug log to check data structure
  console.log('SubscriptionBanner - Full subscriptionStatus:', subscriptionStatus);
  console.log('SubscriptionBanner - Expiry date found:', expiryDate);
  console.log('SubscriptionBanner - Days remaining:', daysRemaining);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 mt-4"
    >
      <div className="relative bg-white border-2 border-blue-200 rounded-xl shadow-sm overflow-hidden">
        {/* Top Accent Line */}
        <div className="h-1 bg-blue-500" />

        {/* Content */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            {/* Left Side - Main Info */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Icon */}
              <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start sm:items-center gap-2 mb-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    {translate('activeSubscription')}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      {translate('active')}
                    </span>
                  </div>
                </div>

                {/* Subscription Details Row - Updated to match Dashboard */}
                <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
                  {expiryDate && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{translate('expiresOn')} <span className="font-semibold">{formatDate(expiryDate)}</span></span>
                    </div>
                  )}
                  {daysRemaining !== null && daysRemaining !== undefined && (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      daysRemaining <= 7 
                        ? 'bg-red-100 text-red-700 border-red-200' 
                        : 'bg-blue-100 text-blue-700 border-blue-200'
                    }`}>
                      <Clock className="h-3.5 w-3.5" />
                      <span className="font-bold">{daysRemaining}</span>
                      <span>{daysRemaining === 1 ? translate('dayLeft') : translate('daysLeft')}</span>
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {translate('reportsAvailableInSubscription', {
                    count: subscriptionStatus.availableReports.total,
                    plural: subscriptionStatus.availableReports.total !== 1 ? 's' : '',
                    plural2: subscriptionStatus.availableReports.total !== 1 ? 'हैं' : 'है'
                  })}
                </p>

                {/* Stats - Compact Inline */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {subscriptionStatus.availableReports.premium > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                      <Crown className="h-3.5 w-3.5 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-700">
                        {subscriptionStatus.availableReports.premium} {translate('premium')}
                      </span>
                    </div>
                  )}
                  {subscriptionStatus.availableReports.bluechip > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-100">
                      <Gem className="h-3.5 w-3.5 text-purple-600" />
                      <span className="text-xs font-semibold text-purple-700">
                        {subscriptionStatus.availableReports.bluechip} {translate('bluechip')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Info Card (Desktop Only) */}
            <div className="hidden lg:flex flex-col gap-3 max-w-xs">
              {/* Info Card */}
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
                <div className="flex-shrink-0 p-1.5 bg-blue-100 rounded-md">
                  <Info className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-gray-900 mb-1">
                    {translate('howToUse')}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">
                    {translate('clickPurchaseButton')} <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-white rounded text-xs font-medium">
                      <ShoppingCart className="h-3 w-3" />
                      {translate('purchaseReportButton')}
                    </span> {translate('chooseUseSubscription')}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>{translate('noExtraPayment')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>{translate('instantAccess')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onDismiss}
              className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
              aria-label="Dismiss banner"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mobile Info Section */}
          <div className="lg:hidden mt-3 pt-3 border-t border-gray-200 space-y-3">
            {/* Days Remaining - Mobile - Updated condition */}
            {daysRemaining !== null && daysRemaining !== undefined && (
              <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${
                daysRemaining <= 7 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <Clock className={`h-5 w-5 ${
                  daysRemaining <= 7 ? 'text-red-600' : 'text-blue-600'
                }`} />
                <div>
                  <span className={`text-xl font-bold ${
                    daysRemaining <= 7 ? 'text-red-700' : 'text-blue-700'
                  }`}>
                    {daysRemaining}
                  </span>
                  <span className={`text-sm font-medium ml-1 ${
                    daysRemaining <= 7 ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {daysRemaining === 1 ? translate('dayLeft') : translate('daysLeft')}
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-3">
              <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {translate('clickPurchaseButton')} <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-white rounded text-xs font-medium">
                    <ShoppingCart className="h-3 w-3" />
                    {translate('purchaseReportButton')}
                  </span> {translate('chooseUseSubscription')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionBanner;
