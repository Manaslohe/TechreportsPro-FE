import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  FileText, 
  ShoppingCart, 
  Eye, 
  Search, 
  Filter,
  Download,
  Star,
  Clock,
  TrendingUp,
  Award,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../common/Toast';

const Catalog = () => {
  const [reports, setReports] = useState([]);
  const [purchasedReports, setPurchasedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

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

      setToast({
        show: true,
        message: errorMessage,
        type: 'error'
      });

      if (['AUTH_REQUIRED', 'TOKEN_EXPIRED'].includes(error.response?.data?.code)) {
        setTimeout(() => navigate('/signin'), 2000);
      }
    }
  };

  const handleDownload = (fileUrl) => {
    window.open(`${axios.defaults.baseURL}${fileUrl}`, '_blank');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      y: -2,
      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 lg:py-24 mb-8"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Reports Catalog
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-4">
              Explore our curated collection of investment insights and analysis
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {filteredReports.length} reports
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Purchased Reports Section */}
      <AnimatePresence>
        {purchasedReports.length > 0 && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
          >
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Your Purchased Reports</h2>
                  <p className="text-sm text-green-700">Access your content anytime</p>
                </div>
              </div>
              
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {purchasedReports.map((report) => (
                  <motion.div
                    key={report._id}
                    variants={cardVariants}
                    whileHover="hover"
                    className="group bg-white rounded-lg p-5 border border-green-200 relative"
                  >
                    {/* Premium Badge */}
                    <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-0.5 rounded text-xs font-medium">
                      OWNED
                    </div>
                    
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg text-green-600">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-base mb-1 line-clamp-2">
                          {report.title}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500 gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(report.uploadDate)}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>

                    {/* Action Button */}
                    <Link
                      to={`/report/view/${report._id}`}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <Eye className="h-3 w-3" />
                      Read Report
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Available Reports Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Available Reports</h2>
            <p className="text-sm text-gray-600">Premium insights for your investment journey</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50 rounded-xl">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-gray-500 text-sm">Loading reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-gray-50 rounded-xl"
          >
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No reports found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search terms</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredReports.map((report) => (
              <motion.div
                key={report._id}
                variants={cardVariants}
                whileHover="hover"
                className="group bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-base mb-1 line-clamp-2">
                        {report.title}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(report.uploadDate)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-3">
                    {report.description}
                  </p>

                  {/* Features */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400" />
                      <span>Premium</span>
                    </div>
                  </div>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-lg font-semibold text-gray-900">₹500</span>
                      <span className="text-xs text-gray-500 ml-1">one-time</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePurchase(report._id)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <ShoppingCart className="h-3 w-3" />
                    Purchase Report
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

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
  