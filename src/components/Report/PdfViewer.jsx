import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  X, 
  Maximize2, 
  Minimize2,
  Download,
  Shield,
  AlertTriangle,
  RefreshCw,
  Lock,
  Eye
} from 'lucide-react';
import axios from 'axios';
import Toast from '../common/Toast';

const PdfViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  
  // State management
  const [report, setReport] = useState(null);
  const [previewFileUrl, setPreviewFileUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [pdfLoadError, setPdfLoadError] = useState(false);

  // Security and protection hooks
  useEffect(() => {
    fetchReport();
  }, [id]);

  // Enhanced security measures
  useEffect(() => {
    const disableRightClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      showToast('Right-click is disabled for security', 'error');
      return false;
    };

    const disableKeyboardShortcuts = (e) => {
      // Comprehensive keyboard shortcut blocking
      const forbidden = (
        (e.ctrlKey && ['s', 'p', 'a', 'c', 'u'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) ||
        e.key === 'PrintScreen'
      );

      if (forbidden) {
        e.preventDefault();
        e.stopPropagation();
        showToast('This action is not permitted', 'error');
        return false;
      }
    };

    const disableSelection = () => {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.mozUserSelect = 'none';
      document.body.style.msUserSelect = 'none';
    };

    const disableCopyPaste = (e) => {
      if (e.type === 'copy' || e.type === 'cut') {
        e.preventDefault();
        showToast('Copying is disabled', 'error');
        return false;
      }
    };

    // Apply all security measures
    document.addEventListener('contextmenu', disableRightClick, true);
    document.addEventListener('keydown', disableKeyboardShortcuts, true);
    document.addEventListener('copy', disableCopyPaste, true);
    document.addEventListener('cut', disableCopyPaste, true);
    disableSelection();

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', disableRightClick, true);
      document.removeEventListener('keydown', disableKeyboardShortcuts, true);
      document.removeEventListener('copy', disableCopyPaste, true);
      document.removeEventListener('cut', disableCopyPaste, true);
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.mozUserSelect = '';
      document.body.style.msUserSelect = '';
    };
  }, []);

  // Prevent fullscreen API abuse
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isFullScreen]);

  const showToast = useCallback((message, type = 'error') => {
    setToast({ show: true, message, type });
  }, []);

  const fetchReport = async (retryCount = 3) => {
    try {
      setLoading(true);
      setError(null);
      setPdfLoadError(false);

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`/api/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000
      });

      if (!response.data) {
        throw new Error('No report data received');
      }

      setReport(response.data);
      
      const secureUrl = `${axios.defaults.baseURL}/api/reports/${id}/pdf?mode=inline&nocache=${Date.now()}&secure=true&token=${encodeURIComponent(token)}`;
      setPreviewFileUrl(secureUrl);

    } catch (error) {
      console.error('Error fetching report:', error);

      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return fetchReport(retryCount - 1);
      }

      let errorMessage = 'Unable to load report';
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have access to this report';
      } else if (error.response?.status === 404) {
        errorMessage = 'Report not found';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      }

      setError(errorMessage);
      showToast(errorMessage, 'error');
      
      if (error.response?.status !== 401) {
        setTimeout(() => navigate('/catalog'), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const retryLoading = async () => {
    setIsRetrying(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await fetchReport();
    setIsRetrying(false);
  };

  const toggleFullScreen = async () => {
    try {
      if (!isFullScreen) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
          setIsFullScreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullScreen(false);
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      showToast('Fullscreen mode not supported', 'error');
    }
  };

  const handlePdfError = () => {
    setPdfLoadError(true);
    showToast('PDF failed to load. Please try refreshing.', 'error');
  };

  // Modern Loading Component
  const LoadingComponent = () => (
    <div className="flex flex-col gap-6 justify-center items-center min-h-[70vh] px-4">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-0 w-20 h-20 border-4 border-blue-100 rounded-full opacity-30" />
      </div>
      <div className="text-center max-w-md">
        <p className="text-2xl font-bold text-gray-900 mb-3">Loading Document</p>
        <p className="text-gray-600 text-sm sm:text-base">Preparing your secure PDF viewer...</p>
      </div>
      <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-full border border-blue-100">
        <Shield className="text-blue-600" size={18} />
        <span className="text-sm font-medium text-blue-900">Protected Mode Active</span>
        <Lock className="text-blue-600" size={14} />
      </div>
    </div>
  );

  // Modern Error Component
  const ErrorComponent = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-md mx-auto px-4">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="bg-red-50 p-6 rounded-full mb-6"
      >
        <AlertTriangle className="text-red-500" size={56} />
      </motion.div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
      <p className="text-gray-600 mb-8 leading-relaxed text-sm sm:text-base">{error}</p>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={retryLoading}
          disabled={isRetrying}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={18} className={isRetrying ? 'animate-spin' : ''} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/catalog')}
          className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          <ArrowLeft size={18} className="inline mr-2" />
          Back to Catalog
        </motion.button>
      </div>
    </div>
  );

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 ${isFullScreen ? 'fixed inset-0 z-50' : 'pt-16 sm:pt-20'}`}
      onContextMenu={(e) => e.preventDefault()}
      style={{ touchAction: 'pan-y pinch-zoom' }}
    >
      {/* Main Content */}
      <div 
        ref={containerRef}
        className={`transition-all duration-300 ${
          isFullScreen 
            ? 'w-full h-full bg-gray-900' 
            : 'max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8'
        }`}
      >
        {loading ? (
          <LoadingComponent />
        ) : error ? (
          <ErrorComponent />
        ) : (
          <AnimatePresence>
            {previewFileUrl && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4 }}
                className={`bg-white overflow-hidden ${
                  isFullScreen 
                    ? 'w-full h-full' 
                    : 'rounded-2xl shadow-2xl shadow-blue-500/10 border border-blue-100'
                }`}
              >
                {/* Modern PDF Header */}
                <div className={`p-3 sm:p-5 flex justify-between items-center backdrop-blur-sm ${
                  isFullScreen 
                    ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                }`}>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-white/10 rounded-lg backdrop-blur">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-xl font-bold">
                        Secure Document Viewer
                      </h2>
                      {!isFullScreen && (
                        <div className="flex items-center gap-2 mt-1">
                          <Eye size={12} className="opacity-75" />
                          <span className="text-xs text-blue-100">View-Only Mode</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!isFullScreen && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleFullScreen}
                        className="p-2 sm:p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all backdrop-blur"
                        title="Enter Fullscreen"
                      >
                        <Maximize2 size={18} />
                      </motion.button>
                    )}
                    
                    {isFullScreen && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleFullScreen}
                        className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                        title="Exit Fullscreen"
                      >
                        <Minimize2 size={18} />
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/catalog')}
                      className="p-2 sm:p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all backdrop-blur"
                      title="Close"
                    >
                      <X size={18} />
                    </motion.button>
                  </div>
                </div>

                {/* PDF Container with Mobile Support */}
                <div 
                  className={`relative bg-gray-100 ${
                    isFullScreen ? 'h-[calc(100vh-70px)]' : 'h-[calc(100vh-200px)] sm:h-[85vh]'
                  }`}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ 
                    touchAction: 'pan-y pinch-zoom',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  {pdfLoadError ? (
                    <div className="flex flex-col items-center justify-center h-full px-4">
                      <div className="bg-orange-50 p-6 rounded-2xl mb-4">
                        <AlertTriangle className="text-orange-500 mx-auto" size={48} />
                      </div>
                      <p className="text-gray-700 font-medium mb-4 text-center">Failed to load PDF</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setPdfLoadError(false);
                          setPreviewFileUrl(`${previewFileUrl}&retry=${Date.now()}`);
                        }}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg"
                      >
                        Retry Loading
                      </motion.button>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <embed
                        ref={iframeRef}
                        src={`${previewFileUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                        type="application/pdf"
                        className="w-full h-full"
                        onError={handlePdfError}
                        style={{
                          backgroundColor: '#f8fafc',
                          border: 'none',
                          touchAction: 'pan-y pinch-zoom'
                        }}
                      />
                      
                      {/* Security Overlay - doesn't block native PDF controls */}
                      <div 
                        className="absolute inset-0 pointer-events-none select-none"
                        onContextMenu={(e) => e.preventDefault()}
                        style={{
                          background: 'transparent',
                          userSelect: 'none',
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          msUserSelect: 'none',
                          WebkitTouchCallout: 'none'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Modern Status Bar */}
                {!isFullScreen && (
                  <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-50 to-white border-t border-blue-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-2 text-blue-700 font-medium">
                          <Shield size={16} />
                          <span>Protected Document</span>
                        </div>
                        <div className="hidden sm:block w-px h-4 bg-blue-200" />
                        <div className="hidden sm:flex items-center gap-2 text-gray-600">
                          <Lock size={14} />
                          <span>Download Disabled</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="hidden sm:inline">💡 Use pinch gesture to zoom on mobile</span>
                        <span className="sm:hidden">💡 Pinch to zoom</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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

export default PdfViewer;