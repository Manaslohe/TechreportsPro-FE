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
  Gift
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../contexts/TranslationContext';

const ReportCard = React.memo(({ report, type = 'paid', onPurchase, onSampleDownload, viewMode = 'grid' }) => {
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
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="group bg-white rounded-xl border-2 border-gray-100 overflow-hidden shadow-sm hover:border-gray-200 transition-all duration-300"
      >
        <div className="p-5 lg:p-6">
          <div className="flex items-start gap-4">
            {/* Icon with gradient background */}
            <div className={`p-3 rounded-xl flex-shrink-0 shadow-sm ${
              type === 'free' 
                ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                : 'bg-gradient-to-br from-blue-600 to-indigo-700'
            }`}>
              {type === 'free' ? (
                <Gift className="w-5 h-5 text-white" />
              ) : (
                <FileText className="w-5 h-5 text-white" />
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
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold shadow-sm ${
                      type === 'free' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                      {report.sector}
                    </span>
                    {type === 'free' && (
                      <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200 shadow-sm">
                        FREE
                      </span>
                    )}
                  </div>
                </div>
                {type === 'paid' && (
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-gray-900">₹{report.price || 555}</div>
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
                  {type === 'free' ? (
                    <button
                      onClick={() => onSampleDownload(report._id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <Download className="h-4 w-4" />
                      {translate('download')}
                    </button>
                  ) : report.isPurchased ? (
                    <Link
                      to={`/report/view/${report._id}`}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <Eye className="h-4 w-4" />
                      {translate('read')}
                    </Link>
                  ) : (
                    <button
                      onClick={() => onPurchase(report._id, report.title)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {translate('purchase')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view - Enhanced design
  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="group bg-white rounded-xl border-2 border-gray-100 overflow-hidden shadow-sm hover:border-gray-200 transition-all duration-300 h-full flex flex-col"
    >
      <div className="p-5 lg:p-6 flex flex-col h-full">
        {/* Header with gradient icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`p-3 rounded-xl flex-shrink-0 shadow-md ${
              type === 'free' 
                ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                : 'bg-gradient-to-br from-blue-600 to-indigo-700'
            }`}>
              {type === 'free' ? (
                <Gift className="w-5 h-5 text-white" />
              ) : (
                <FileText className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-base lg:text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                {report.title}
              </h3>
            </div>
          </div>
          {type === 'paid' && (
            <div className="text-right flex-shrink-0 ml-3">
              <div className="text-xl lg:text-2xl font-bold text-gray-900">₹{report.price || 555}</div>
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
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span className="font-medium">{report.downloadCount}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${
            type === 'free' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}>
            {report.sector}
          </span>
          {type === 'free' && (
            <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200 shadow-sm">
              FREE
            </span>
          )}
        </div>

        {/* Description - takes available space */}
        <div className="flex-grow mb-5">
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
            {report.description}
          </p>

          {/* Features */}
          <div className="flex items-center gap-4 text-xs">
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

        {/* Action Button - pushed to bottom */}
        <div className="mt-auto">
          {type === 'free' ? (
            <button
              onClick={() => onSampleDownload(report._id)}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
              <Download className="h-4 w-4" />
              {translate('downloadFree')}
            </button>
          ) : report.isPurchased ? (
            <Link
              to={`/report/view/${report._id}`}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
              <Eye className="h-4 w-4" />
              {translate('readReport')}
            </Link>
          ) : (
            <button
              onClick={() => onPurchase(report._id, report.title)}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
              <ShoppingCart className="h-4 w-4" />
              {translate('purchaseReport')}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
});

ReportCard.displayName = 'ReportCard';

export default ReportCard;
