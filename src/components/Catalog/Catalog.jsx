import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle,
  Gift,
  FileText,
  Lock,
  Calendar,
  Eye,
  Sparkles,
  Crown
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../common/Toast';
import CatalogHeader from './CatalogHeader';
import ReportCard from './ReportCard';
import PaymentChoiceModal from './PaymentChoiceModal';

const Catalog = () => {
  const [reports, setReports] = useState([]);
  const [purchasedReports, setPurchasedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedSector, setSelectedSector] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [paymentChoiceModal, setPaymentChoiceModal] = useState({
    isOpen: false,
    reportId: null,
    reportTitle: ''
  });
  const [processingSubscription, setProcessingSubscription] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
    fetchPurchasedReports();
    fetchSubscriptionStatus();
  }, []);

  const fetchReports = async () => {
    try {
        const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
        const response = await axios.get(`${baseURL}/api/reports/filtered`, {
            params: {
                searchTerm,
                sector: selectedSector,
                sortBy,
                sortOrder
            }
        });
        setReports(response.data);
    } catch (error) {
        console.error('Error fetching reports:', error);
    } finally {
        setLoading(false);
    }
  };

  const fetchPurchasedReports = async () => {
    try {
      const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await axios.get(`${baseURL}/api/users/purchased-reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPurchasedReports(response.data);
    } catch (error) {
      console.error('Error fetching purchased reports:', error);
      const errorMessage = {
        'AUTH_REQUIRED': 'Please login to view purchased reports',
        'TOKEN_EXPIRED': 'Session expired. Please login again',
      }[error.response?.data?.code] || 'Error fetching purchased reports';

      if (['AUTH_REQUIRED', 'TOKEN_EXPIRED'].includes(error.response?.data?.code)) {
        // Don't navigate away, just log the error
        console.error(errorMessage);
      }
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await axios.get(`${baseURL}/api/users/subscription`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscriptionStatus(response.data);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    }
  };

  const handlePurchase = useCallback((reportId, reportTitle) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setToast({
        show: true,
        message: 'Please sign in to purchase reports',
        type: 'error'
      });
      setTimeout(() => navigate('/signin'), 2000);
      return;
    }

    if (subscriptionStatus?.hasActive && subscriptionStatus?.availableReports?.total > 0) {
      setPaymentChoiceModal({
        isOpen: true,
        reportId,
        reportTitle
      });
    } else {
      navigate(`/payment/report/${reportId}`);
    }
  }, [subscriptionStatus, navigate]);

  const handleSampleDownload = useCallback((reportId) => {
    window.open(`${axios.defaults.baseURL}/api/reports/${reportId}/pdf`, '_blank');
    setToast({
      show: true,
      message: 'Opening sample report...',
      type: 'success'
    });
  }, []);

  const handleUseSubscription = async () => {
    setProcessingSubscription(true);
    try {
      const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
      const token = localStorage.getItem('authToken');

      const response = await axios.post(
        `${baseURL}/api/reports/${paymentChoiceModal.reportId}/use-subscription`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setToast({
        show: true,
        message: 'Report added to your library successfully! 🎉',
        type: 'success'
      });

      // Refresh data
      fetchPurchasedReports();
      fetchSubscriptionStatus();
      
      // Close modal
      setPaymentChoiceModal({ isOpen: false, reportId: null, reportTitle: '' });

      // Navigate to report view after short delay
      setTimeout(() => {
        navigate(`/report/view/${paymentChoiceModal.reportId}`);
      }, 1500);
    } catch (error) {
      console.error('Error using subscription:', error);
      const errorMessage = {
        'NO_SUBSCRIPTION': 'No active subscription found',
        'NO_REPORTS_LEFT': 'No reports left in your subscription',
        'ALREADY_ACCESSED': 'You have already accessed this report',
        'AUTH_REQUIRED': 'Please login to continue',
        'TOKEN_EXPIRED': 'Session expired. Please login again'
      }[error.response?.data?.code] || 'Failed to access report. Please try again.';

      setToast({
        show: true,
        message: errorMessage,
        type: 'error'
      });

      if (['AUTH_REQUIRED', 'TOKEN_EXPIRED'].includes(error.response?.data?.code)) {
        setTimeout(() => navigate('/signin'), 2000);
      }
    } finally {
      setProcessingSubscription(false);
    }
  };

  const handlePayIndividually = () => {
    setPaymentChoiceModal({ isOpen: false, reportId: null, reportTitle: '' });
    navigate(`/payment/report/${paymentChoiceModal.reportId}`);
  };

  const filterAndSortReports = useCallback((reportsList) => {
    let filtered = reportsList.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = selectedSector === 'all' || report.sector === selectedSector;
      return matchesSearch && matchesSector;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return sortOrder === 'desc' ? new Date(b.uploadDate) - new Date(a.uploadDate) : new Date(a.uploadDate) - new Date(b.uploadDate);
        case 'old':
          return sortOrder === 'desc' ? new Date(a.uploadDate) - new Date(b.uploadDate) : new Date(b.uploadDate) - new Date(a.uploadDate);
        case 'name':
          return sortOrder === 'desc' ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedSector, sortBy, sortOrder]);

  const { freeReports, paidReports } = useMemo(() => {
    const free = filterAndSortReports(reports.filter(r => r.isFree === true));
    const paid = filterAndSortReports(reports.filter(r => !r.isFree).map(report => ({
      ...report,
      isPurchased: purchasedReports.some(purchased => purchased._id === report._id)
    })));
    return { freeReports: free, paidReports: paid };
  }, [reports, purchasedReports, filterAndSortReports]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedSector('all');
    setSortBy('recent');
    setSortOrder('desc');
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const NoResultsFound = ({ type }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200"
    >
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        {type === 'free' ? (
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Gift className="h-10 w-10 text-green-500" />
          </div>
        ) : (
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <FileText className="h-10 w-10 text-blue-500" />
          </div>
        )}
      </motion.div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        No {type === 'free' ? 'sample' : 'premium'} reports found
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        {searchTerm || selectedSector !== 'all' ? (
          <>Try adjusting your search terms or filters to discover more reports.</>
        ) : (
          <>Check back soon for new {type === 'free' ? 'sample' : 'premium'} reports.</>
        )}
      </p>
      {(searchTerm || selectedSector !== 'all') && (
        <button
          onClick={clearFilters}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium"
        >
          Clear All Filters
        </button>
      )}
    </motion.div>
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <CatalogHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        viewMode={viewMode}
        setViewMode={setViewMode}
        clearFilters={clearFilters}
        totalReports={reports.length}
        sampleReportsCount={freeReports.length}
        filteredResults={freeReports.length + paidReports.length}
      />

      {/* Purchased Reports Section - Redesigned */}
      <AnimatePresence>
        {purchasedReports.length > 0 && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
          >
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 lg:p-8 border-2 border-green-200 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-green-600 rounded-xl shadow-md">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Library</h2>
                  <p className="text-green-700 text-sm">
                    {purchasedReports.length} {purchasedReports.length === 1 ? 'report' : 'reports'} • Full access anytime
                  </p>
                </div>
              </div>
              
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
              >
                {purchasedReports.map((report) => (
                  <motion.div
                    key={report._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="bg-white rounded-xl p-5 border-2 border-green-200 hover:border-green-300 transition-all shadow-sm hover:shadow-md group"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-green-50 rounded-lg text-green-600 group-hover:bg-green-100 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block px-2 py-0.5 bg-green-600 text-white rounded-full text-xs font-semibold mb-2">
                          OWNED
                        </span>
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-green-700 transition-colors">
                          {report.title}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {formatDate(report.uploadDate)}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>

                    <Link
                      to={`/report/view/${report._id}`}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium shadow-sm hover:shadow-md"
                    >
                      <Eye className="h-4 w-4" />
                      Read Report
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
            </div>
            <p className="text-gray-600 text-lg mt-6 font-medium">Loading reports...</p>
          </motion.div>
        ) : (
          <>
            {/* Sample Reports Section - Redesigned */}
            <section className="mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Free Sample Reports</h2>
                    <p className="text-gray-600">Experience premium analysis at no cost</p>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm border border-green-200">
                    {freeReports.length} Available
                  </div>
                </div>
              </motion.div>

              {freeReports.length === 0 ? (
                <NoResultsFound type="free" />
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6' : 'space-y-4'}
                >
                  {freeReports.map((report) => (
                    <ReportCard 
                      key={report._id} 
                      report={report} 
                      type="free" 
                      onSampleDownload={handleSampleDownload}
                      viewMode={viewMode}
                    />
                  ))}
                </motion.div>
              )}
            </section>

            {/* Premium Reports Section - Redesigned */}
            <section>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Premium Reports</h2>
                    <p className="text-gray-600">In-depth research for informed decisions</p>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm border border-blue-200">
                    {paidReports.length} Available
                  </div>
                </div>
              </motion.div>

              {paidReports.length === 0 ? (
                <NoResultsFound type="premium" />
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6' : 'space-y-4'}
                >
                  {paidReports.map((report) => (
                    <ReportCard 
                      key={report._id} 
                      report={report} 
                      type="paid" 
                      onPurchase={handlePurchase}
                      viewMode={viewMode}
                    />
                  ))}
                </motion.div>
              )}
            </section>
          </>
        )}
      </div>

      {/* Payment Choice Modal */}
      <PaymentChoiceModal
        isOpen={paymentChoiceModal.isOpen}
        onClose={() => setPaymentChoiceModal({ isOpen: false, reportId: null, reportTitle: '' })}
        reportTitle={paymentChoiceModal.reportTitle}
        availableReports={subscriptionStatus?.availableReports || { total: 0, premium: 0, bluechip: 0 }}
        onUseSubscription={handleUseSubscription}
        onPayIndividually={handlePayIndividually}
        loading={processingSubscription}
      />

      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Catalog;
