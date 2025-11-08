import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Star, 
  Calendar, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  ArrowRight,
  Sparkles,
  Crown,
  Gift
} from 'lucide-react';
import axios from 'axios';
import Toast from './common/Toast';
import { useNavigate } from 'react-router-dom';

const StatCard = React.memo(({ icon: Icon, label, value, gradient, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.4, ease: "easeOut" }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        className={`p-3 rounded-xl ${gradient} shadow-sm`}
      >
        <Icon className="w-7 h-7 text-white" />
      </motion.div>
    </div>
  </motion.div>
));

StatCard.displayName = 'StatCard';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setToast({
        show: true,
        message: 'Please login to access dashboard',
        type: 'error',
      });
      setTimeout(() => navigate('/signin'), 2000);
      return;
    }
    
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.get('/api/users/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setDashboardData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      if (error.response?.status === 401 || error.response?.data?.code === 'TOKEN_EXPIRED') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setToast({
          show: true,
          message: 'Session expired. Please login again.',
          type: 'error',
        });
        setTimeout(() => navigate('/signin'), 2000);
      } else if (error.response?.status === 404) {
        setError('User not found. Please contact support.');
      } else {
        setError('Failed to load dashboard. Please try again.');
        setToast({
          show: true,
          message: 'Error loading dashboard data',
          type: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysLeft = (expiryDate) => {
    const days = Math.max(0, Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)));
    return days;
  };

  // Memoized stats
  const stats = useMemo(() => {
    if (!dashboardData) return null;
    return [
      { 
        icon: FileText, 
        label: 'Total Reports', 
        value: dashboardData.stats?.totalReportsAccessed || 0, 
        gradient: 'bg-gradient-to-br from-blue-500 to-blue-600' 
      },
      { 
        icon: Clock, 
        label: 'Pending Payments', 
        value: dashboardData.stats?.pendingPayments || 0, 
        gradient: 'bg-gradient-to-br from-purple-500 to-purple-600' 
      },
      { 
        icon: TrendingUp, 
        label: 'Total Spent', 
        value: `₹${dashboardData.stats?.totalSpent || 0}`, 
        gradient: 'bg-gradient-to-br from-green-500 to-emerald-600' 
      },
    ];
  }, [dashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white pt-20">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto" style={{ animationDuration: '1.5s' }} />
          </div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white pt-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Dashboard Error</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={fetchDashboardData}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
            >
              Go Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { user = {}, subscription = { hasActive: false }, pendingRequests = [], purchasedReports = [] } = dashboardData;

  // Add expired subscription handling in the frontend
  const ExpiredSubscriptionBanner = ({ subscription, onRenew }) => (
    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 mb-1">Subscription Expired</h3>
          <p className="text-sm text-amber-700 mb-3">
            Your {subscription.current?.planName} subscription expired on {new Date(subscription.current?.expiryDate).toLocaleDateString()}.
            Renew to continue accessing premium reports.
          </p>
          <button
            onClick={onRenew}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
          >
            Renew Subscription
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4 border border-white/20"
            >
              <Sparkles className="h-4 w-4" />
              Your Dashboard
            </motion.div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl">
              Manage your subscriptions, track your reports, and stay updated
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-16 relative z-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats?.map((stat, index) => (
            <StatCard key={stat.label} {...stat} delay={0.1 + index * 0.05} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Subscription Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Subscription Status</h2>
              </div>
              
              <AnimatePresence mode="wait">
                {subscription?.hasActive ? (
                  <motion.div
                    key="active"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Active Plan Card */}
                    <div className="relative overflow-hidden p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full -mr-16 -mt-16" />
                      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 bg-green-500 rounded-xl shadow-md">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-green-900 text-lg mb-1">
                              {subscription.current?.planName || 'Active Plan'}
                            </h3>
                            <p className="text-sm text-green-700 flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              Expires on {subscription.current?.expiryDate ? formatDate(subscription.current.expiryDate) : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-green-200">
                            <span className="text-2xl font-bold text-green-600">
                              {subscription.current?.expiryDate ? getDaysLeft(subscription.current.expiryDate) : 0}
                            </span>
                            <span className="text-xs text-green-700 font-medium ml-1">days left</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reports Available */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <motion.div 
                        whileHover={{ y: -2 }}
                        className="text-center p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 shadow-sm"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-blue-600 mb-1">
                          {subscription.availableReports?.premium || 0}
                        </p>
                        <p className="text-sm text-blue-700 font-medium">Premium Reports</p>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ y: -2 }}
                        className="text-center p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 shadow-sm"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-purple-600 mb-1">
                          {subscription.availableReports?.bluechip || 0}
                        </p>
                        <p className="text-sm text-purple-700 font-medium">Bluechip Reports</p>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ y: -2 }}
                        className="text-center p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 shadow-sm"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                          <Gift className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-gray-600 mb-1">
                          {subscription.availableReports?.total || 0}
                        </p>
                        <p className="text-sm text-gray-700 font-medium">Total Available</p>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="inactive"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No Active Subscription
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto leading-relaxed">
                      Subscribe to a plan to get access to premium investment reports
                    </p>
                    <button
                      onClick={() => navigate('/plans')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium"
                    >
                      View Plans
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Pending Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Pending Requests</h2>
              </div>
              
              {pendingRequests && pendingRequests.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {pendingRequests.map((request, index) => (
                    <motion.div
                      key={request._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {request.status?.charAt(0).toUpperCase() + request.status?.slice(1) || 'Pending'}
                        </span>
                        <span className="text-base font-bold text-gray-900">
                          ₹{request.amount || 0}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                        {request.paymentType === 'subscription' 
                          ? `${request.subscriptionPlan?.planName || 'Subscription'} Plan`
                          : request.report?.title || 'Individual Report'
                        }
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {request.createdAt ? formatDate(request.createdAt) : 'N/A'}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-gray-600 text-sm font-medium">No pending requests</p>
                  <p className="text-gray-500 text-xs mt-1">All clear! 🎉</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Recent Reports</h2>
              </div>
              <button
                onClick={() => navigate('/catalog')}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors group"
              >
                Browse All Reports
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {purchasedReports && purchasedReports.length > 0 ? (
              <div className="space-y-3">
                {purchasedReports.slice(0, 5).map((purchase, index) => (
                  <motion.div
                    key={purchase._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ x: 4 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                  >
                    <div className="flex items-start gap-4 mb-3 sm:mb-0 flex-1 min-w-0">
                      <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {purchase.reportId?.title || 'Report Title'}
                        </h4>
                        <p className="text-sm text-gray-500 mb-2 flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{purchase.reportId?.sector || 'N/A'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {purchase.purchaseDate ? formatDate(purchase.purchaseDate) : 'N/A'}
                          </span>
                        </p>
                        <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${
                          purchase.accessType === 'subscription' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                            : 'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                          {purchase.accessType === 'subscription' ? '📋 Via Subscription' : '💳 Individual Purchase'}
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/report/view/${purchase.reportId?._id}`)}
                      disabled={!purchase.reportId?._id}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      title="View Report"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">View</span>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports accessed yet</h3>
                <p className="text-gray-600 mb-6">Start exploring our premium investment reports</p>
                <button
                  onClick={() => navigate('/catalog')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  Browse Reports
                </button>
              </div>
            )}
          </div>
        </motion.div>
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

export default Dashboard;
