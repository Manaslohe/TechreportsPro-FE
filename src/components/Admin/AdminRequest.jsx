import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, User, Calendar, Clock, CheckCircle, XCircle, 
  Search, Filter, Eye, DollarSign, FileText, X, ArrowRight,
  ChevronDown, ExternalLink, AlertCircle, Clipboard, Shield
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
      const response = await axios.get('/api/payment-requests', {
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
      
      await axios.post(`/api/payment-requests/${id}/verify`, {
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

  // Update the filtering logic
  const filteredRequests = requests.filter(request => {
    // Apply filter
    if (filter !== 'all') {
      if (!request.status?.toLowerCase().includes(filter.toLowerCase())) {
        return false;
      }
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
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const toggleRequestDetails = (id) => {
    setSelectedRequestId((prevId) => (prevId === id ? null : id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 min-h-screen">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Payment Requests</h1>
              <p className="text-slate-500 mt-1">Review and manage payment verifications</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  <Clock size={12} />
                  {requests.filter(r => r.status === 'pending').length} Pending
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  <CheckCircle size={12} />
                  {requests.filter(r => r.status === 'approved').length} Approved
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <XCircle size={12} />
                  {requests.filter(r => r.status === 'rejected').length} Rejected
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
                placeholder="Search by user or report title..."
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto sm:min-w-[200px]">
              <Filter className="text-slate-400 w-4 h-4" />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending Only</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 mt-6">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-slate-500">Loading payment requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-12"
            >
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 inline-block max-w-md">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">No Requests Found</h3>
                <p className="text-slate-500 mb-6">
                  {searchQuery 
                    ? "No requests match your search criteria" 
                    : filter !== 'all' 
                      ? `No ${filter} requests available` 
                      : "No payment requests have been submitted yet"}
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilter('all');
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <ArrowRight size={16} className="mr-2" />
                  Reset Filters
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-4"
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
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

const RequestCard = ({ 
  request, 
  isSelected, 
  onToggle, 
  onApprove, 
  onReject, 
  comment, 
  onCommentChange, 
  isSubmitting,
  variants
}) => {
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
          borderColor: 'border-amber-400',
          bgColor: 'bg-amber-50',
          badgeClass: 'bg-amber-100 text-amber-800',
          icon: Clock
        };
      case 'approved':
        return {
          borderColor: 'border-emerald-400',
          bgColor: 'bg-emerald-50',
          badgeClass: 'bg-emerald-100 text-emerald-800',
          icon: CheckCircle
        };
      case 'rejected':
        return {
          borderColor: 'border-red-400',
          bgColor: 'bg-red-50',
          badgeClass: 'bg-red-100 text-red-800',
          icon: XCircle
        };
      default:
        return {
          borderColor: 'border-slate-200',
          bgColor: 'bg-white',
          badgeClass: 'bg-slate-100 text-slate-800',
          icon: AlertCircle
        };
    }
  };

  const statusConfig = getStatusConfig(request.status);

  return (
    <motion.div
      variants={variants}
      layout
      className={`bg-white rounded-xl shadow-sm border ${statusConfig.borderColor} overflow-hidden transition-all duration-200 hover:shadow-md`}
    >
      <div className="p-5 cursor-pointer" onClick={onToggle}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${statusConfig.bgColor}`}>
                <DollarSign className={`w-6 h-6 ${request.status === 'pending' ? 'text-amber-600' : request.status === 'approved' ? 'text-emerald-600' : 'text-red-600'}`} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h3 className="font-medium text-slate-800 truncate max-w-md">
                  {request.report?.title || "Report Payment Request"}
                </h3>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.badgeClass}`}>
                  <statusConfig.icon size={12} />
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[150px]">
                    {request.user?.firstName} {request.user?.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(request.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTime(request.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {request.status === 'pending' && (
              <div className="hidden sm:block">
                <span className="inline-flex h-2 w-2 bg-amber-500 rounded-full animate-pulse mr-2"></span>
                <span className="text-xs font-medium text-amber-600">Awaiting Review</span>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                isSelected 
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              {isSelected ? (
                <>
                  <ChevronDown size={16} />
                  Hide Details
                </>
              ) : (
                <>
                  <Eye size={16} />
                  View Details
                </>
              )}
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
            transition={{ duration: 0.3 }}
            className="border-t border-slate-100"
          >
            <div className="p-5 space-y-6">
              {/* Request Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                    <Shield size={14} />
                    Request Information
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Report Title</p>
                      <p className="text-sm font-medium text-slate-800">{request.report?.title || "Unnamed Report"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Requested by</p>
                      <p className="text-sm font-medium text-slate-800">
                        {request.user?.firstName} {request.user?.lastName}
                        <span className="ml-2 text-xs text-slate-500">({request.user?.email})</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Request ID</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-mono bg-slate-100 p-1 rounded text-slate-600">{request._id}</p>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(request._id);
                            setToast({ show: true, message: 'ID copied to clipboard', type: 'success' });
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Clipboard size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Screenshot */}
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                    <DollarSign size={14} />
                    Payment Proof
                  </h4>
                  <div className="bg-slate-50 rounded-lg overflow-hidden">
                    <div className="relative">
                      <img
                        src={request.screenshotData}
                        alt="Payment Screenshot"
                        className="w-full max-h-[300px] object-contain"
                      />
                      <div className="absolute top-2 right-2">
                        <a 
                          href={request.screenshotData} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Show admin response for processed requests */}
              {request.status !== 'pending' ? (
                <div className={`p-4 rounded-lg ${
                  request.status === 'approved' ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'
                }`}>
                  <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                    <MessageSquare size={16} className={request.status === 'approved' ? 'text-emerald-500' : 'text-red-500'} />
                    Admin Response
                  </h4>
                  <p className={`text-sm ${
                    request.status === 'approved' ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {request.adminComment || `Request ${request.status}`}
                  </p>
                  {request.reviewedAt && (
                    <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
                      <Clock size={12} />
                      Processed on: {new Date(request.reviewedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              ) : (
                /* Action buttons for pending requests */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Admin Comment {request.status === 'rejected' && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => onCommentChange(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none shadow-sm"
                      rows="3"
                      placeholder="Add a comment about this payment request..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                    <button
                      onClick={onReject}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Payment
                    </button>
                    <button
                      onClick={onApprove}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Payment
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
};

export default AdminRequest;
