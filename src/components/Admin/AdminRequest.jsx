import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, User, Calendar, Clock, CheckCircle, XCircle, 
  Search, Filter, Eye, DollarSign, FileText, X, ArrowRight,
  ChevronDown, ExternalLink, AlertCircle, Clipboard, Shield,
  TrendingUp, Bell, Send
} from 'lucide-react';
import axios from 'axios';
import Toast from '../common/Toast';

const AdminRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [comment, setComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
      const response = await axios.get(`${baseURL}/api/payment-requests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'x-admin-auth': localStorage.getItem('adminAuth') === 'true' ? 'true' : undefined
        }
      });
      setRequests(response.data);
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.error || 'Error fetching requests',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    // Poll for new requests every 30 seconds
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  const handleAction = async (id, status) => {
    try {
      if (status === 'rejected' && !comment.trim()) {
        setToast({
          show: true,
          message: 'Please provide a reason for rejection',
          type: 'error'
        });
        return;
      }

      setIsSubmitting(true);
      const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
      await axios.post(`${baseURL}/api/payment-requests/${id}/verify`, {
        status,
        adminComment: comment.trim() || (status === 'approved' ? 'Payment approved' : '')
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'x-admin-auth': localStorage.getItem('adminAuth') === 'true' ? 'true' : undefined
        }
      });

      // Update local state
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === id 
            ? { 
                ...req, 
                status, 
                adminComment: comment.trim() || (status === 'approved' ? 'Payment approved' : ''),
                reviewedAt: new Date()
              } 
            : req
        )
      );

      setToast({
        show: true,
        message: `Request ${status} successfully`,
        type: 'success'
      });
      
      setSelectedRequestId(null);
      setComment('');
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.error || `Error ${status === 'approved' ? 'approving' : 'rejecting'} request`,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRequests = useMemo(() => 
    requests.filter(request => {
      // Apply filter
      if (filter !== 'all' && !request.status?.toLowerCase().includes(filter.toLowerCase())) {
        return false;
      }
      
      // Apply search
      if (searchQuery.trim()) {
        const searchLower = searchQuery.toLowerCase();
        return (
          request.user?.firstName?.toLowerCase().includes(searchLower) ||
          request.user?.lastName?.toLowerCase().includes(searchLower) ||
          request.report?.title?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [requests, searchQuery, filter]
  );

  const stats = useMemo(() => ({
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    totalAmount: requests.reduce((acc, r) => acc + (r.amount || 0), 0)
  }), [requests]);

  const toggleRequestDetails = useCallback((id) => {
    setSelectedRequestId((prevId) => (prevId === id ? null : id));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-20 backdrop-blur-lg bg-white/80 border-b border-slate-200/50"
      >
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-6">
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <StatCard
                icon={Clock}
                label="Pending"
                value={stats.pending}
                color="amber"
              />
              <StatCard
                icon={CheckCircle}
                label="Approved"
                value={stats.approved}
                color="emerald"
              />
              <StatCard
                icon={XCircle}
                label="Rejected"
                value={stats.rejected}
                color="rose"
              />
              <StatCard
                icon={DollarSign}
                label="Total Amount"
                value={`₹${stats.totalAmount.toLocaleString()}`}
                color="indigo"
              />
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-indigo-50/30 transition-all duration-200"
                  placeholder="Search by user or report title..."
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="text-slate-400 w-4 h-4 flex-shrink-0" />
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200"
                >
                  <option value="all">All Requests</option>
                  <option value="pending">Pending Only</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <LoadingState />
          ) : filteredRequests.length === 0 ? (
            <EmptyState searchQuery={searchQuery} filter={filter} onReset={() => {
              setSearchQuery('');
              setFilter('all');
            }} />
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3 sm:space-y-4"
            >
              {filteredRequests.map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  isSelected={selectedRequestId === request._id}
                  onToggle={() => toggleRequestDetails(request._id)}
                  onApprove={() => handleAction(request._id, 'approved')}
                  onReject={() => handleAction(request._id, 'rejected')}
                  comment={comment}
                  onCommentChange={setComment}
                  isSubmitting={isSubmitting}
                  variants={itemVariants}
                  onToast={setToast}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorMap = {
    amber: 'from-amber-500/10 to-amber-500/5 border-amber-200/30 hover:border-amber-300/50',
    emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-200/30 hover:border-emerald-300/50',
    rose: 'from-rose-500/10 to-rose-500/5 border-rose-200/30 hover:border-rose-300/50',
    indigo: 'from-indigo-500/10 to-indigo-500/5 border-indigo-200/30 hover:border-indigo-300/50'
  };

  const iconColorMap = {
    amber: 'text-amber-600',
    emerald: 'text-emerald-600',
    rose: 'text-rose-600',
    indigo: 'text-indigo-600'
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-4 sm:p-5 transition-all duration-200 cursor-default group`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-600 text-xs sm:text-sm font-medium mb-1">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <Icon className={`${iconColorMap[color]} w-5 h-5 sm:w-6 sm:h-6 opacity-60 group-hover:opacity-100 transition-opacity`} />
      </div>
    </motion.div>
  );
};

const LoadingState = () => (
  <div className="flex justify-center items-center py-20">
    <div className="relative">
      <div className="w-10 h-10 border-4 border-indigo-200 rounded-full animate-spin" />
      <div className="absolute inset-0 w-10 h-10 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin" />
    </div>
  </div>
);

const EmptyState = ({ searchQuery, filter, onReset }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-center items-center py-16 sm:py-20"
  >
    <div className="text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-slate-700 font-semibold text-lg mb-1">No Requests Found</h3>
      <p className="text-slate-500 text-sm mb-6">
        {searchQuery 
          ? "No requests match your search criteria" 
          : filter !== 'all' 
            ? `No ${filter} requests available` 
            : "No payment requests have been submitted yet"}
      </p>
      <button 
        onClick={onReset}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
      >
        <ArrowRight size={16} />
        Reset Filters
      </button>
    </div>
  </motion.div>
);

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
  onToast
}) => {
  const [isSendingNotification, setIsSendingNotification] = React.useState(false);

  const handleSendNotification = async () => {
    try {
      setIsSendingNotification(true);
      const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
      await axios.post(
        `${baseURL}/api/admin/payment-requests/${request._id}/notify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'x-admin-auth': localStorage.getItem('adminAuth') === 'true' ? 'true' : undefined
          }
        }
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
  };

  // Format date and time for better display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Get border and badge colors based on status
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

  const statusConfig = getStatusConfig(request.status);

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
                  {request.report?.title || "Payment Request"}
                </h3>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.badgeClass}`}>
                  <statusConfig.icon size={12} />
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
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
                      <p className="text-xs text-slate-500 font-medium mb-1">Report Title</p>
                      <p className="text-sm text-slate-900">{request.report?.title || "Unnamed Report"}</p>
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
                          onClick={() => {
                            navigator.clipboard.writeText(request._id);
                            onToast({ show: true, message: 'ID copied', type: 'success' });
                          }}
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

export default AdminRequest;
