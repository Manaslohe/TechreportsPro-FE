import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Eye
} from 'lucide-react';
import axios from 'axios';
import Toast from './common/Toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
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
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('/api/users/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-20">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={fetchDashboardData}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Available</h2>
          <p className="text-gray-600 mb-6">Unable to load dashboard data</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Safely destructure with defaults
  const { 
    user = {}, 
    subscription = { hasActive: false, availableReports: { premium: 0, bluechip: 0, total: 0 } }, 
    pendingRequests = [], 
    purchasedReports = [], 
    stats = { totalReportsAccessed: 0, totalSpent: 0, pendingPayments: 0 } 
  } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Blue Header Background */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-blue-100 text-base sm:text-lg">
              Manage your subscriptions and access your reports
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content - Overlapping Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Total Reports</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats?.totalReportsAccessed || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Points Earned</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{user?.points || 0}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Pending Payments</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats?.pendingPayments || 0}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Total Spent</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">₹{stats?.totalSpent || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Subscription Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Subscription Status</h2>
              
              {subscription?.hasActive ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                    <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                      <div className="bg-green-500 p-2 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-900 text-base sm:text-lg">
                          {subscription.current?.planName || 'Active Plan'}
                        </h3>
                        <p className="text-sm text-green-700">
                          Expires on {subscription.current?.expiryDate ? formatDate(subscription.current.expiryDate) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-white text-green-800 rounded-full text-sm font-medium shadow-sm">
                      {subscription.current?.expiryDate ? getDaysLeft(subscription.current.expiryDate) : 0} days left
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <p className="text-3xl font-bold text-blue-600 mb-1">
                        {subscription.availableReports?.premium || 0}
                      </p>
                      <p className="text-xs sm:text-sm text-blue-700 font-medium">Premium Reports Left</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <p className="text-3xl font-bold text-purple-600 mb-1">
                        {subscription.availableReports?.bluechip || 0}
                      </p>
                      <p className="text-xs sm:text-sm text-purple-700 font-medium">Bluechip Reports Left</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <p className="text-3xl font-bold text-gray-600 mb-1">
                        {subscription.availableReports?.total || 0}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700 font-medium">Total Reports Left</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Active Subscription
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm sm:text-base">
                    Subscribe to a plan to get access to premium reports
                  </p>
                  <button
                    onClick={() => navigate('/plans')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                  >
                    View Plans
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Pending Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Pending Requests</h2>
              
              {pendingRequests && pendingRequests.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {pendingRequests.map((request) => (
                    <div key={request._id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status?.charAt(0).toUpperCase() + request.status?.slice(1) || 'Pending'}
                        </span>
                        <span className="text-sm font-semibold text-gray-700">
                          ₹{request.amount || 0}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {request.paymentType === 'subscription' 
                          ? `${request.subscriptionPlan?.planName || 'Subscription'} Plan`
                          : request.report?.title || 'Individual Report'
                        }
                      </h4>
                      <p className="text-xs text-gray-500">
                        {request.createdAt ? formatDate(request.createdAt) : 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm">No pending requests</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
              <h2 className="text-xl font-bold text-gray-900">Recent Reports</h2>
              <button
                onClick={() => navigate('/catalog')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base transition-colors"
              >
                Browse All Reports →
              </button>
            </div>
            
            {purchasedReports && purchasedReports.length > 0 ? (
              <div className="space-y-3">
                {purchasedReports.slice(0, 5).map((purchase, index) => (
                  <div key={purchase._id || index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all group">
                    <div className="flex items-start sm:items-center space-x-4 mb-3 sm:mb-0 flex-1">
                      <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors flex-shrink-0">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                          {purchase.reportId?.title || 'Report Title'}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {purchase.reportId?.sector || 'N/A'} • {purchase.purchaseDate ? formatDate(purchase.purchaseDate) : 'N/A'}
                        </p>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                          purchase.accessType === 'subscription' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {purchase.accessType === 'subscription' ? 'Via Subscription' : 'Individual Purchase'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() => navigate(`/report/view/${purchase.reportId?._id}`)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View Report"
                        disabled={!purchase.reportId?._id}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">No reports accessed yet</p>
                <button
                  onClick={() => navigate('/catalog')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
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
