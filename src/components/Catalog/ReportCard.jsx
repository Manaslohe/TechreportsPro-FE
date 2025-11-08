import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  FileText, 
  ShoppingCart, 
  Eye, 
  Download,
  Star,
  Users,
  BarChart3,
  Gift,
  CheckCircle,
  Crown,
  Gem
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../contexts/TranslationContext';

const ReportCard = React.memo(({ report, type = 'paid', onPurchase, onSampleDownload, onDownloadPurchased, viewMode = 'grid' }) => {
  const { translate } = useTranslation();
  const navigate = useNavigate();
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    hover: { 
      y: -4,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Determine actual type based on reportType field
  const actualType = report.reportType === 'free' ? 'free' : type;
  const isFree = report.reportType === 'free';
  const isPremium = report.reportType === 'premium';
  const isBluechip = report.reportType === 'bluechip';

  // Report type badge configuration
  const getReportTypeBadge = () => {
    if (isFree) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700 border border-green-200 shadow-sm">
          <Gift className="w-3 h-3" />
          {translate('free')}
        </span>
      );
    }
    if (isBluechip) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200 shadow-sm">
          <Gem className="w-3 h-3" />
          {translate('bluechip')}
        </span>
      );
    }
    if (isPremium) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
          <Crown className="w-3 h-3" />
          {translate('premium')}
        </span>
      );
    }
    return null;
  };

  // Gradient colors based on report type
  const getGradientColors = () => {
    if (isFree) return 'from-green-500 to-emerald-600';
    if (isBluechip) return 'from-purple-600 to-purple-700';
    return 'from-blue-600 to-blue-700';
  };

  // Purchased Report Card (only grid view)
  if (type === 'purchased') {
    return (
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative h-full flex flex-col"
      >
        {/* Gradient Overlay on Hover - Subtle */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Top Accent Line */}
        <div className={`h-1 bg-gradient-to-r ${getGradientColors()}`} />
        
        {/* Card Content */}
        <div className="relative p-6 flex flex-col h-full">
          {/* Header Section */}
          <div className="flex items-start gap-3 mb-4">
            <div className={`p-3 bg-gradient-to-br ${getGradientColors()} rounded-xl group-hover:shadow-lg transition-all duration-300 flex-shrink-0 shadow-md`}>
              {isFree ? (
                <Gift className="w-5 h-5 text-white" />
              ) : isBluechip ? (
                <Gem className="w-5 h-5 text-white" />
              ) : (
                <Crown className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-bold text-gray-900 text-base line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors flex-1">
                  {report.title}
                </h3>
                {/* Owned Badge - Compact */}
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                  <CheckCircle className="w-3 h-3" />
                  <span className="hidden sm:inline">{translate('owned')}</span>
                </span>
              </div>
              
              {/* Badges Row - Sector + Report Type */}
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {report.sector && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {report.sector}
                  </span>
                )}
                {getReportTypeBadge()}
                {/* Text Badge for Bluechip or Premium */}
                {report.reportType === 'bluechip' && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                    {translate('bluechip')}
                  </span>
                )}
                {report.reportType === 'premium' && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                    {translate('premium')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-medium">{formatDate(report.uploadDate)}</span>
            </div>
          </div>

          {/* Description */}
          <div className="flex-grow mb-5">
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {report.description}
            </p>
          </div>

          {/* Divider - Subtle gradient */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-5" />

          {/* Action Buttons - Modern Layout */}
          <div className="flex gap-2.5 mt-auto">
            <Link
              to={`/report/view/${report._id}`}
              className="flex items-center justify-center gap-2 flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg text-sm group/btn"
            >
              <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              <span>{translate('viewReport')}</span>
            </Link>
            {onDownloadPurchased && (
              <button
                onClick={() => onDownloadPurchased(report._id, report.title)}
                className="flex items-center justify-center px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all duration-300 font-semibold shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300 group/btn"
                title="Download PDF"
              >
                <Download className="h-4 w-4 group-hover/btn:scale-110 group-hover/btn:text-blue-600 transition-all" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Accent - Subtle animation */}
        <div className={`h-0.5 bg-gradient-to-r ${getGradientColors()} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      </motion.div>
    );
  }

  // List View
  if (viewMode === 'list') {
    return (
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative"
      >
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <div className="p-5 lg:p-6 relative">
          <div className="flex items-start gap-4">
            {/* Icon with gradient background */}
            <div className={`p-3 rounded-xl flex-shrink-0 shadow-md transition-all duration-300 bg-gradient-to-br ${getGradientColors()} group-hover:shadow-lg`}>
              {isFree ? (
                <Gift className="w-5 h-5 text-white" />
              ) : isBluechip ? (
                <Gem className="w-5 h-5 text-white" />
              ) : (
                <Crown className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug">
                    {report.title}
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border bg-gray-100 text-gray-700 border-gray-200">
                      {report.sector}
                    </span>
                    {getReportTypeBadge()}
                  </div>
                </div>
                {!isFree && (
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">₹{report.price || 555}</div>
                    <div className="text-xs text-gray-500 font-medium">{translate('oneTime')}</div>
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4">
                {report.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{formatDate(report.uploadDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="font-medium">{translate('expertAnalysisLabel')}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                  {isFree ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/report/view/${report._id}`)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-500/30 font-medium"
                    >
                      <Eye size={18} />
                      {translate('viewSample')}
                    </motion.button>
                  ) : report.isPurchased ? (
                    <Link
                      to={`/report/view/${report._id}`}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg group/btn"
                    >
                      <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      {translate('read')}
                    </Link>
                  ) : (
                    <button
                      onClick={() => onPurchase(report._id, report.title)}
                      className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${
                        isBluechip ? 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800' : 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                      } text-white rounded-xl transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg group/btn`}
                    >
                      <ShoppingCart className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      {translate('purchase')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className={`h-1 bg-gradient-to-r ${getGradientColors()} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col relative"
    >
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="p-5 lg:p-6 flex flex-col h-full relative">
        {/* Header with gradient icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`p-3 rounded-xl flex-shrink-0 shadow-md transition-all duration-300 bg-gradient-to-br ${getGradientColors()} group-hover:shadow-lg`}>
              {isFree ? (
                <Gift className="w-5 h-5 text-white" />
              ) : isBluechip ? (
                <Gem className="w-5 h-5 text-white" />
              ) : (
                <Crown className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-base lg:text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                {report.title}
              </h3>
            </div>
          </div>
          {!isFree && (
            <div className="text-right flex-shrink-0 ml-3">
              <div className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">₹{report.price || 555}</div>
              <div className="text-xs text-gray-500 font-medium">{translate('oneTime')}</div>
            </div>
          )}
        </div>
        
        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{formatDate(report.uploadDate)}</span>
          </div>
        </div>

        {/* Badges Row - Sector + Report Type - MOVED ABOVE DESCRIPTION */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            {report.sector}
          </span>
          {getReportTypeBadge()}
        </div>

        {/* Description - takes available space */}
        <div className="flex-grow mb-5">
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
            {report.description}
          </p>

          {/* Features */}
          <div className="flex items-center gap-4 text-xs flex-wrap">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="font-medium">{translate('expertAnalysisLabel')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <BarChart3 className="h-3.5 w-3.5 text-blue-500" />
              <span className="font-medium">{translate('dataInsights')}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

        {/* Action Button - pushed to bottom */}
        <div className="mt-auto">
          {isFree ? (
            <button
              onClick={() => onSampleDownload(report._id)}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg group/btn"
            >
              <Download className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              {translate('downloadFree')}
            </button>
          ) : report.isPurchased ? (
            <Link
              to={`/report/view/${report._id}`}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg group/btn"
            >
              <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              {translate('readReport')}
            </Link>
          ) : (
            <button
              onClick={() => onPurchase(report._id, report.title)}
              className={`flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r ${
                isBluechip ? 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800' : 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
              } text-white rounded-xl transition-all duration-300 font-semibold shadow-md hover:shadow-lg group/btn`}
            >
              <ShoppingCart className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              {translate('purchaseReport')}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className={`h-1 bg-gradient-to-r ${getGradientColors()} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </motion.div>
  );
});

ReportCard.displayName = 'ReportCard';

export default ReportCard;
