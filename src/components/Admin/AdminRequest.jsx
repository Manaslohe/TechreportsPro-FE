import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, User, Calendar, Clock, CheckCircle, XCircle, 
  Search, Filter, Eye, DollarSign, FileText, X, ArrowRight 
} from 'lucide-react';
import axios from 'axios';
import Toast from '../common/Toast';

const AdminRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [selectedRequestId, setSelectedRequestId] = useState(null); // Track the selected card
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
    setSelectedRequestId((prevId) => (prevId === id ? null : id)); // Toggle the selected card
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment Requests</h1>
              <p className="text-gray-500 mt-1">Review and manage payment verifications</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium 
                ${requests.filter(r => r.status === 'pending').length > 0 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-gray-100 text-gray-600'}`}>
                {requests.filter(r => r.status === 'pending').length} Pending
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {requests.filter(r => r.status === 'approved').length} Approved
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Search by user or report..."
              />
            </div>
            <div className="flex items-center gap-2 min-w-[200px]">
              <Filter className="text-gray-400 w-4 h-4" />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 inline-block">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Requests Found</h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? "No requests match your search criteria" 
                    : filter !== 'all' 
                      ? `No ${filter} requests available` 
                      : "No payment requests yet"}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
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
                />
              ))}
            </div>
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
  isSubmitting 
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${
        request.status === 'pending' ? 'border-l-4 border-yellow-400' : ''
      }`}
    >
      <div className="p-6 cursor-pointer" onClick={onToggle}>
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                ${request.status === 'pending' 
                  ? 'bg-yellow-100 text-yellow-700'
                  : request.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-gray-900">{request.report?.title}</h3>
                <StatusBadge status={request.status} />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>{request.user?.firstName} {request.user?.lastName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(request.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click from toggling
              onToggle();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {isSelected ? 'Hide Details' : 'View Details'}
          </button>
        </div>
      </div>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 pt-6 border-t space-y-6"
        >
          {/* Payment Screenshot */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Payment Screenshot</h4>
            <img
              src={request.screenshotData}
              alt="Payment Screenshot"
              className="rounded-lg max-h-[400px] object-contain mx-auto"
            />
          </div>

          {/* Show admin response for processed requests */}
          {request.status !== 'pending' ? (
            <div className={`p-4 rounded-lg ${
              request.status === 'approved' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <h4 className="font-medium text-gray-900 mb-2">Admin Response</h4>
              <p className={`text-sm ${
                request.status === 'approved' ? 'text-green-700' : 'text-red-700'
              }`}>
                {request.adminComment || `Request ${request.status}`}
              </p>
              {request.reviewedAt && (
                <div className="mt-2 text-xs text-gray-500">
                  Processed on: {new Date(request.reviewedAt).toLocaleString()}
                </div>
              )}
            </div>
          ) : (
            /* Action buttons for pending requests */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Comment {request.status === 'rejected' && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => onCommentChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows="3"
                  placeholder="Add a comment about this request..."
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={onReject}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Reject Request
                </button>
                <button
                  onClick={onApprove}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Request
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    pending: {
      className: 'bg-yellow-100 text-yellow-800',
      icon: Clock,
    },
    approved: {
      className: 'bg-green-100 text-green-800',
      icon: CheckCircle,
    },
    rejected: {
      className: 'bg-red-100 text-red-800',
      icon: XCircle,
    }
  };

  const { className, icon: Icon } = config[status] || {};
  
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default AdminRequest;
