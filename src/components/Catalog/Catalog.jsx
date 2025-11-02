import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle,
  Gift,
  FileText,
  Lock,
  Calendar,
  Eye,
  Sparkles,
  Crown,
  Download
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
  const [viewMode, setViewMode] = useState('grid');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [paymentChoiceModal, setPaymentChoiceModal] = useState({
    isOpen: false,
    reportId: null,
    reportTitle: ''
  });
  const [processingSubscription, setProcessingSubscription] = useState(false);
  const [downloading, setDownloading] = useState(false);
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

  const handlePurchase = (reportId, reportTitle) => {
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

    // Check if user has active subscription with available reports
    if (subscriptionStatus?.hasActive && subscriptionStatus?.availableReports?.total > 0) {
      setPaymentChoiceModal({
        isOpen: true,
        reportId,
        reportTitle
      });
    } else {
      // No active subscription or no reports left, go directly to payment
      navigate(`/payment/report/${reportId}`);
    }
  };

  const handleSampleDownload = (reportId) => {
    window.open(`${axios.defaults.baseURL}/api/reports/${reportId}/pdf`, '_blank');
    setToast({
      show: true,
      message: 'Opening sample report...',
      type: 'success'
    });
  };

  const handleDownloadPurchased = async (reportId, reportTitle) => {
    setDownloading(true);
    try {
      const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
      const token = localStorage.getItem('authToken');
      
      const response = await axios.get(`${baseURL}/api/reports/${reportId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setToast({
        show: true,
        message: 'Download started successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Download error:', error);
      setToast({
        show: true,
        message: 'Failed to download report',
        type: 'error'
      });
    } finally {
      setDownloading(false);
    }
  };

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

  const filterAndSortReports = (reportsList) => {
    let filtered = reportsList.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Sort reports
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
  };

  // Separate free and paid reports
  const freeReports = filterAndSortReports(reports.filter(r => r.isFree === true));
  const paidReports = filterAndSortReports(reports.filter(r => !r.isFree).map(report => ({
    ...report,
    isPurchased: purchasedReports.some(purchased => purchased._id === report._id)
  })));

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('recent');
    setSortOrder('desc');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const NoResultsFound = ({ type }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 bg-gray-50 rounded-xl"
    >
      <div className="mb-4">
        {type === 'free' ? (
          <Gift className="h-16 w-16 text-gray-300 mx-auto" />
        ) : (
          <FileText className="h-16 w-16 text-gray-300 mx-auto" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No {type === 'free' ? 'sample' : 'premium'} reports found
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {searchTerm ? (
          <>Try adjusting your search terms to find what you're looking for.</>
        ) : (
          <>Check back later for new {type === 'free' ? 'sample' : 'premium'} reports.</>
        )}
      </p>
      {searchTerm && (
        <button
          onClick={clearFilters}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Clear Filters
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

  const isMobile = window.innerWidth <= 768; // Check if the screen size is mobile

  return (
    <div className="min-h-screen bg-gray-50">
      <CatalogHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        viewMode={viewMode}
        setViewMode={!isMobile ? setViewMode : undefined}
        clearFilters={clearFilters}
        totalReports={reports.length}
        sampleReportsCount={freeReports.length}
        filteredResults={freeReports.length + paidReports.length}
      />

      {/* Purchased Reports Section - Redesigned with ReportCard */}
      <AnimatePresence>
        {purchasedReports.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg shadow-blue-500/30">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Library</h2>
                  <p className="text-sm text-gray-600">Access your purchased reports anytime</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-700">{purchasedReports.length} {purchasedReports.length === 1 ? 'Report' : 'Reports'}</span>
              </div>
            </div>
              
            {/* Cards Grid using ReportCard */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {purchasedReports.map((report) => (
                <ReportCard
                  key={report._id}
                  report={report}
                  type="purchased"
                  onDownloadPurchased={handleDownloadPurchased}
                  viewMode="grid"
                />
              ))}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-sm"
          >
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 text-lg">Loading reports...</p>
          </motion.div>
        ) : (
          <>
            {/* Sample Reports Section */}
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Sparkles className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl lg:text-3xl font-bold text-gray-900">Free Sample Reports</h2>
                  <p className="text-gray-600">Get a taste of our premium analysis at no cost</p>
                </div>
                <div className="ml-auto">
                  <div className="bg-green-100 text-green-800 text-nowrap px-4 py-2 rounded-full text-sm font-medium">
                    {freeReports.length} Available
                  </div>
                </div>
              </div>

              {freeReports.length === 0 ? (
                <NoResultsFound type="free" />
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
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

            {/* Premium Reports Section */}
            <section className="pb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Crown className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">One Time Reports</h2>
                  <p className="text-gray-600">In-depth analysis and expert insights for serious investors</p>
                </div>
                <div className="ml-auto">
                  <div className="bg-blue-100 text-blue-800 text-nowrap px-4 py-2 rounded-full text-sm font-medium">
                    {paidReports.length} Available
                  </div>
                </div>
              </div>

              {paidReports.length === 0 ? (
                <NoResultsFound type="premium" />
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
                >
                  {paidReports.map((report) => (
                    <ReportCard 
                      key={report._id} 
                      report={report} 
                      type="paid" 
                      onPurchase={handlePurchase}
                      onDownloadPurchased={handleDownloadPurchased}
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
