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

const ReportCard = ({ report, type = 'paid', onPurchase, onSampleDownload, viewMode = 'grid' }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      y: -3,
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
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
        className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
      >
        <div className="p-6">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className={`p-3 rounded-xl flex-shrink-0 ${type === 'free' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
              {type === 'free' ? <Gift className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                  {report.title}
                </h3>
                {type === 'paid' && (
                  <div className="text-right ml-4 flex-shrink-0">
                    <div className="text-xl font-bold text-gray-900">₹{report.price || 500}</div>
                    <div className="text-xs text-gray-500">one-time</div>
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                {report.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(report.uploadDate)}
                  </div>
                  {report.downloadCount && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {report.downloadCount}
                    </div>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    type === 'free' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {report.sector}
                  </span>
                  {type === 'free' && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      FREE
                    </span>
                  )}
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0 ml-4">
                  {type === 'free' ? (
                    <button
                      onClick={() => onSampleDownload(report._id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  ) : report.isPurchased ? (
                    <Link
                      to={`/report/view/${report._id}`}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      <Eye className="h-4 w-4" />
                      Read
                    </Link>
                  ) : (
                    <button
                      onClick={() => onPurchase(report._id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Purchase
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

  // Grid view - with flex layout to push button to bottom
  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full"
    >
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`p-3 rounded-xl flex-shrink-0 ${type === 'free' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
              {type === 'free' ? <Gift className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors leading-6">
                {report.title}
              </h3>
            </div>
          </div>
          {type === 'paid' && (
            <div className="text-right flex-shrink-0 ml-4">
              <div className="text-xl font-bold text-gray-900">₹{report.price || 500}</div>
              <div className="text-xs text-gray-500">one-time</div>
            </div>
          )}
        </div>
        
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(report.uploadDate)}
          </div>
          {report.downloadCount && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {report.downloadCount}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
            type === 'free' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {report.sector}
          </span>
          {type === 'free' && (
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
              FREE
            </span>
          )}
        </div>

        {/* Description - flex-grow to take available space */}
        <div className="flex-grow">
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
            {report.description}
          </p>

          {/* Features */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-400" />
              <span>Expert Analysis</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3 text-blue-400" />
              <span>Data Insights</span>
            </div>
          </div>
        </div>

        {/* Action Button - pushed to bottom with mt-auto */}
        <div className="mt-auto">
          {type === 'free' ? (
            <button
              onClick={() => onSampleDownload(report._id)}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-sm hover:shadow-md transform hover:scale-[1.02]"
            >
              <Download className="h-4 w-4" />
              Download Free
            </button>
          ) : report.isPurchased ? (
            <Link
              to={`/report/view/${report._id}`}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-sm hover:shadow-md transform hover:scale-[1.02]"
            >
              <Eye className="h-4 w-4" />
              Read Report
            </Link>
          ) : (
            <button
              onClick={() => onPurchase(report._id)}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-sm hover:shadow-md transform hover:scale-[1.02]"
            >
              <ShoppingCart className="h-4 w-4" />
              Purchase Report
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReportCard;
