import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Search, Filter, X, ArrowRight,
  FileText, Clock, CheckCircle, XCircle, DollarSign
} from 'lucide-react';
import axios from 'axios';
import Toast from '../common/Toast';
import RequestCard from './AdminRequest/RequestCard';
import RequestStats from './AdminRequest/RequestStats';
import RequestFilters from './AdminRequest/RequestFilters';

// Memoized Loading Component
const LoadingState = React.memo(() => (
  <div className="flex justify-center items-center py-20">
    <div className="relative">
      <div className="w-10 h-10 border-4 border-indigo-200 rounded-full animate-spin" />
      <div className="absolute inset-0 w-10 h-10 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin" />
    </div>
  </div>
));

LoadingState.displayName = 'LoadingState';

// Memoized Empty State Component
const EmptyState = React.memo(({ searchQuery, filter, onReset }) => (
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
));

EmptyState.displayName = 'EmptyState';

const AdminRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [comment, setComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoized API config
  const apiConfig = useMemo(() => {
    const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
    const token = localStorage.getItem('authToken');
    const isAdmin = localStorage.getItem('adminAuth') === 'true';
    
    return {
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
        'x-admin-auth': 'true'
      },
      isValid: !!(token && isAdmin)
    };
  }, []);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!apiConfig.isValid) {
        throw new Error('Admin authentication required');
      }
      
      const response = await axios.get(`${apiConfig.baseURL}/api/payment-requests`, {
        headers: apiConfig.headers
      });
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setToast({
        show: true,
        message: error.response?.data?.error || 'Error fetching requests',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [apiConfig]);

  useEffect(() => {
    fetchRequests();
    // Poll for new requests every 30 seconds
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  const handleAction = useCallback(async (id, status) => {
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
      
      await axios.post(`${apiConfig.baseURL}/api/payment-requests/${id}/verify`, {
        status,
        adminComment: comment.trim() || (status === 'approved' ? 'Payment approved' : '')
      }, {
        headers: apiConfig.headers
      });

      // Update local state optimistically
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
  }, [apiConfig, comment]);

  // Memoized filtered requests
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

  // Memoized stats
  const stats = useMemo(() => ({
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    totalAmount: requests.reduce((acc, r) => acc + (r.amount || 0), 0)
  }), [requests]);

  const toggleRequestDetails = useCallback((id) => {
    setSelectedRequestId((prevId) => (prevId === id ? null : id));
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setFilter('all');
  }, []);

  const handleToastClose = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  }), []);

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
            {/* Stats Grid */}
            <div className="mb-6">
              <RequestStats stats={stats} />
            </div>

            {/* Search and Filter */}
            <RequestFilters
              searchQuery={searchQuery}
              filter={filter}
              onSearchChange={setSearchQuery}
              onFilterChange={setFilter}
            />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <LoadingState />
          ) : filteredRequests.length === 0 ? (
            <EmptyState 
              searchQuery={searchQuery} 
              filter={filter} 
              onReset={handleResetFilters} 
            />
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
                  apiConfig={apiConfig}
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
        onClose={handleToastClose}
      />
    </div>
  );
};

export default React.memo(AdminRequest);
