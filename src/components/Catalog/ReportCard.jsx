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
import { Link } from 'react-router-dom';
import { useTranslation } from '../../contexts/TranslationContext';

const ReportCard = React.memo(({ report, type = 'paid', onPurchase, onSampleDownload, onDownloadPurchased, viewMode = 'grid' }) => {
  const { translate } = useTranslation();
  
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
          FREE
        </span>
      );
    }
    if (isBluechip) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200 shadow-sm">
          <Gem className="w-3 h-3" />
          BLUECHIP
        </span>
      );
    }
    if (isPremium) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
          <Crown className="w-3 h-3" />
          PREMIUM
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
        className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative h-full flex flex-col"
      >
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Card Content */}
        <div className="relative p-5 flex flex-col h-full">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className={`p-2.5 bg-gradient-to-br ${getGradientColors()} rounded-xl group-hover:shadow-lg transition-all duration-300 flex-shrink-0 shadow-sm`}>
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {report.title}
                </h3>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="flex-shrink-0 ml-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200">
                <CheckCircle className="w-3 h-3" />
                Owned
              </span>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span className="font-medium">{formatDate(report.uploadDate)}</span>
            </div>
            {report.sector && (
              <>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="font-medium px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                  {report.sector}
                </span>
              </>
            )}
          </div>

          {/* Report Type Badge */}
          <div className="mb-4">
            {getReportTypeBadge()}
          </div>

          {/* Description */}
          <div className="flex-grow mb-5">
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {report.description}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            <Link
              to={`/report/view/${report._id}`}
              className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-sm hover:shadow-md text-sm group/btn"
            >
              <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              <span>View</span>
            </Link>
            {onDownloadPurchased && (
              <button
                onClick={() => onDownloadPurchased(report._id, report.title)}
                className="flex items-center justify-center px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 font-medium shadow-sm hover:shadow-md group/btn"
                title="Download PDF"
              >
                <Download className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className={`h-1 bg-gradient-to-r ${getGradientColors()} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      </motion.div>
    );
  }

  // List View - Update with report type badges
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
                  {report.downloadCount && (
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">{report.downloadCount}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="font-medium">{translate('expertAnalysisLabel')}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                  {isFree ? (
                    <button
                      onClick={() => onSampleDownload(report._id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg group/btn"
                    >
                      <Download className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      {translate('download')}
                    </button>
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

  // Grid View - Update with report type badges (similar changes to list view)
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
          {report.downloadCount && (
            <>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span className="font-medium">{report.downloadCount}</span>
              </div>
            </>
          )}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border bg-gray-100 text-gray-700 border-gray-200">
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
