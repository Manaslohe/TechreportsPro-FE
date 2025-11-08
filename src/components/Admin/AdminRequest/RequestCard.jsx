import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Calendar, Clock, CheckCircle, XCircle, 
  Eye, DollarSign, ChevronDown, ExternalLink, 
  AlertCircle, Clipboard, Shield, Send, MessageSquare,
  Sparkles, Crown, Gem
} from 'lucide-react';
import axios from 'axios';

const RequestCard = React.memo(({ 
  request, 
  isSelected, 
  onToggle, 
  onApprove, 
  onReject, 
  comment, 
  onCommentChange, 
  isSubmitting,
  variants,
  onToast,
  apiConfig
}) => {
  const [isSendingNotification, setIsSendingNotification] = useState(false);

  const handleSendNotification = useCallback(async () => {
    try {
      setIsSendingNotification(true);
      await axios.post(
        `${apiConfig.baseURL}/api/admin/payment-requests/${request._id}/notify`,
        {},
        { headers: apiConfig.headers }
      );

      onToast({
        show: true,
        message: 'Notification sent to user successfully!',
        type: 'success'
      });
    } catch (error) {
      onToast({
        show: true,
        message: error.response?.data?.error || 'Failed to send notification',
        type: 'error'
      });
    } finally {
      setIsSendingNotification(false);
    }
  }, [apiConfig, request._id, onToast]);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text);
    onToast({ show: true, message: 'ID copied', type: 'success' });
  }, [onToast]);

  // Memoized format functions
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }, []);

  const formatTime = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  }, []);

  // Memoized status config
  const statusConfig = useMemo(() => {
    const getStatusConfig = (status) => {
      switch(status) {
        case 'pending':
          return {
            borderColor: 'border-amber-200',
            bgColor: 'bg-amber-50',
            badgeClass: 'bg-amber-100 text-amber-700 border-amber-200/50',
            icon: Clock,
            accentColor: 'text-amber-600'
          };
        case 'approved':
          return {
            borderColor: 'border-emerald-200',
            bgColor: 'bg-emerald-50',
            badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200/50',
            icon: CheckCircle,
            accentColor: 'text-emerald-600'
          };
        case 'rejected':
          return {
            borderColor: 'border-rose-200',
            bgColor: 'bg-rose-50',
            badgeClass: 'bg-rose-100 text-rose-700 border-rose-200/50',
            icon: XCircle,
            accentColor: 'text-rose-600'
          };
        default:
          return {
            borderColor: 'border-slate-200',
            bgColor: 'bg-slate-50',
            badgeClass: 'bg-slate-100 text-slate-700 border-slate-200/50',
            icon: AlertCircle,
            accentColor: 'text-slate-600'
          };
      }
    };
    return getStatusConfig(request.status);
  }, [request.status]);

  // Memoized report type badge
  const getReportTypeBadge = useCallback((reportType) => {
    const badges = {
      free: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Sparkles, label: 'Free' },
      premium: { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Crown, label: 'Premium' },
      bluechip: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Gem, label: 'Bluechip' }
    };
    
    const badge = badges[reportType] || badges.premium;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}>
        <Icon size={12} />
        {badge.label}
      </span>
    );
  }, []);

  return (
    <motion.div
      variants={variants}
      layout
      className={`bg-white rounded-xl border ${statusConfig.borderColor} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}
    >
      <div className="p-4 sm:p-6 cursor-pointer" onClick={onToggle}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${statusConfig.bgColor}`}>
              <DollarSign className={`w-5 h-5 sm:w-6 sm:h-6 ${statusConfig.accentColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="font-semibold text-slate-900 line-clamp-1 max-w-xs">
                  {request.report?.title || request.subscriptionPlan?.planName || "Payment Request"}
                </h3>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.badgeClass}`}>
                  <statusConfig.icon size={12} />
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
                {request.isAdminGrant && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700 border border-violet-200">
                    <Shield size={12} />
                    Admin
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-1.5 min-w-0">
                  <User className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                  <span className="truncate">
                    {request.user?.firstName} {request.user?.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                  <span>{formatDate(request.createdAt)}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                  <span>{formatTime(request.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {request.status === 'pending' && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full">
                <span className="inline-flex h-1.5 w-1.5 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-amber-700">Pending</span>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                isSelected 
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}
            >
              <Eye size={16} />
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSelected ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-100"
          >
            <div className="p-4 sm:p-6 space-y-6 bg-slate-50/50">
              {/* Request Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Request Information */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Shield size={16} className="text-indigo-600" />
                    Request Information
                  </h4>
                  <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">
                        {request.paymentType === 'subscription' ? 'Subscription Plan' : 'Report Title'}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-900">
                          {request.report?.title || request.subscriptionPlan?.planName || "Unnamed"}
                        </p>
                        {request.paymentType === 'report' && request.report && getReportTypeBadge(request.report.reportType || 'premium')}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">Requested By</p>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{request.user?.firstName} {request.user?.lastName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{request.user?.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">Amount</p>
                      <p className="text-lg font-semibold text-indigo-600">₹{request.amount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-2">Request ID</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600 truncate">{request._id}</p>
                        <button 
                          onClick={() => copyToClipboard(request._id)}
                          className="text-indigo-600 hover:text-indigo-700 p-1 hover:bg-indigo-50 rounded transition-colors flex-shrink-0"
                        >
                          <Clipboard size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Proof */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <DollarSign size={16} className="text-indigo-600" />
                    Payment Proof
                  </h4>
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div className="relative bg-slate-50">
                      <img
                        src={request.screenshotData}
                        alt="Payment Screenshot"
                        className="w-full max-h-[300px] object-contain"
                      />
                      <a 
                        href={request.screenshotData} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute top-2 right-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Response or Action Buttons */}
              {request.status !== 'pending' ? (
                <>
                  <div className={`p-4 rounded-lg border ${
                    request.status === 'approved' 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-rose-50 border-rose-200'
                  }`}>
                    <h4 className={`font-medium mb-2 flex items-center gap-2 ${
                      request.status === 'approved' 
                        ? 'text-emerald-900' 
                        : 'text-rose-900'
                    }`}>
                      <MessageSquare size={16} />
                      Admin Response
                    </h4>
                    <p className={`text-sm ${
                      request.status === 'approved' 
                        ? 'text-emerald-700' 
                        : 'text-rose-700'
                    }`}>
                      {request.adminComment || `Request ${request.status}`}
                    </p>
                    {request.reviewedAt && (
                      <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
                        <Clock size={12} />
                        {new Date(request.reviewedAt).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSendNotification}
                      disabled={isSendingNotification}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-sm"
                    >
                      {isSendingNotification ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Notify User
                        </>
                      )}
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Admin Comment {request.status === 'rejected' && <span className="text-rose-500">*</span>}
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => onCommentChange(e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none transition-all"
                      rows="3"
                      placeholder="Add a comment about this payment request..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                    <button
                      onClick={onReject}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                    <button
                      onClick={onApprove}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

RequestCard.displayName = 'RequestCard';

export default RequestCard;
