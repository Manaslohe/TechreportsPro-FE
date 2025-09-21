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
  Crown
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../common/Toast';
import CatalogHeader from './CatalogHeader';
import ReportCard from './ReportCard';

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
  const navigate = useNavigate();

  // Sample data for free reports
  const sampleReports = [
    {
      _id: 'sample-1',
      title: 'Market Overview - Monthly Insights',
      description: 'Get a comprehensive overview of market trends, key indicators, and economic factors affecting the stock market.',
      uploadDate: new Date('2024-01-15'),
      sector: 'Market Analysis',
      isFree: true,
      downloadCount: 1250
    },
    {
      _id: 'sample-2', 
      title: 'Technology Sector Analysis',
      description: 'Deep dive into the technology sector performance, growth prospects, and investment opportunities.',
      uploadDate: new Date('2024-01-10'),
      sector: 'Technology',
      isFree: true,
      downloadCount: 890
    },
    {
      _id: 'sample-3',
      title: 'Banking Sector Fundamentals',
      description: 'Comprehensive analysis of banking sector fundamentals, regulatory changes, and growth outlook.',
      uploadDate: new Date('2024-01-05'),
      sector: 'Banking',
      isFree: true,
      downloadCount: 675
    }
  ];

  useEffect(() => {
    fetchReports();
    fetchPurchasedReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('/api/reports');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchasedReports = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await axios.get('/api/users/purchased-reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPurchasedReports(response.data);
    } catch (error) {
      const errorMessage = {
        'AUTH_REQUIRED': 'Please login to view purchased reports',
        'TOKEN_EXPIRED': 'Session expired. Please login again',
      }[error.response?.data?.code] || 'Error fetching purchased reports';

      if (['AUTH_REQUIRED', 'TOKEN_EXPIRED'].includes(error.response?.data?.code)) {
        setTimeout(() => navigate('/signin'), 2000);
      }
    }
  };

  const handlePurchase = (reportId) => {
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
    navigate(`/payment/${reportId}`);
  };

  const handleSampleDownload = (reportId) => {
    setToast({
      show: true,
      message: 'Sample report downloaded successfully!',
      type: 'success'
    });
  };

  const filterAndSortReports = (reportsList) => {
    let filtered = reportsList.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = selectedSector === 'all' || report.sector === selectedSector;
      return matchesSearch && matchesSector;
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
        case 'popular':
          return sortOrder === 'desc' ? (b.downloadCount || 0) - (a.downloadCount || 0) : (a.downloadCount || 0) - (b.downloadCount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredSampleReports = filterAndSortReports(sampleReports);
  const filteredPaidReports = filterAndSortReports(reports.map(report => ({
    ...report,
    isPurchased: purchasedReports.some(purchased => purchased._id === report._id)
  })));

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSector('all');
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
        {searchTerm || selectedSector !== 'all' ? (
          <>Try adjusting your search terms or filters to find what you're looking for.</>
        ) : (
          <>Check back later for new {type === 'free' ? 'sample' : 'premium'} reports.</>
        )}
      </p>
      {(searchTerm || selectedSector !== 'all') && (
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
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        viewMode={viewMode}
        setViewMode={!isMobile ? setViewMode : undefined} // Disable grid-changing button on mobile
        clearFilters={clearFilters}
        totalReports={reports.length + sampleReports.length}
        sampleReportsCount={sampleReports.length}
        filteredResults={filteredSampleReports.length + filteredPaidReports.length}
      />

      {/* Purchased Reports Section - only show if user has purchased reports */}
      <AnimatePresence>
        {purchasedReports.length > 0 && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
          >
            <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Purchased Reports</h2>
                  <p className="text-green-700">Access your premium content anytime</p>
                </div>
              </div>
              
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {purchasedReports.map((report) => (
                  <motion.div
                    key={report._id}
                    className="bg-white rounded-xl p-6 border border-green-200 relative"
                  >
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      OWNED
                    </div>
                    
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg text-green-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {report.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(report.uploadDate)}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {report.description}
                    </p>

                    <Link
                      to={`/report/view/${report._id}`}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
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
                <div className="ml-auto ">
                  <div className="bg-green-100 text-green-800 text-nowrap px-4 py-2 rounded-full text-sm font-medium">
                    {filteredSampleReports.length} Available
                  </div>
                </div>
              </div>

              {filteredSampleReports.length === 0 ? (
                <NoResultsFound type="free" />
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
                >
                  {filteredSampleReports.map((report) => (
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
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Premium Reports</h2>
                  <p className="text-gray-600">In-depth analysis and expert insights for serious investors</p>
                </div>
                <div className="ml-auto">
                  <div className="bg-blue-100 text-blue-800 text-nowrap px-4 py-2 rounded-full text-sm font-medium">
                    {filteredPaidReports.length} Available
                  </div>
                </div>
              </div>

              {filteredPaidReports.length === 0 ? (
                <NoResultsFound type="premium" />
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
                >
                  {filteredPaidReports.map((report) => (
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
