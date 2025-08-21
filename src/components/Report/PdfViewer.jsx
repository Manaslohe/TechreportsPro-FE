import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  X, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Download,
  Shield,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import Toast from '../common/Toast';

const PdfViewer = () => {
  const { reportId } = useParams();
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
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isRetrying, setIsRetrying] = useState(false);
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [downloadAttempts, setDownloadAttempts] = useState(0);

  // Security and protection hooks
  useEffect(() => {
    fetchReport();
  }, [reportId]);

  useEffect(() => {
    const disableRightClick = (e) => {
      e.preventDefault();
      // Removed downloadAttempts increment logic
      showToast('Unauthorized access attempt detected', 'error');
      return false;
    };

    const disableKeyboardShortcuts = (e) => {
      // Disable Ctrl+S, Ctrl+P, Ctrl+A, F12, etc.
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'a')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        showToast('Action not permitted', 'error');
        return false;
      }
    };

    const disableSelection = () => {
      document.onselectstart = () => false;
      document.ondragstart = () => false;
    };

    // Apply security measures
    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableKeyboardShortcuts);
    disableSelection();

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableKeyboardShortcuts);
      document.onselectstart = null;
      document.ondragstart = null;
    };
  }, []); // Removed dependency on downloadAttempts

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

      const response = await axios.get(`/api/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000 // Increased timeout to 15 seconds
      });

      if (!response.data) {
        throw new Error('No report data received');
      }

      setReport(response.data);
      
      // Create secure PDF URL with additional parameters
      const secureUrl = `${axios.defaults.baseURL}/api/pdf/${reportId}?mode=inline&nocache=${Date.now()}&secure=true`;
      setPreviewFileUrl(secureUrl);

    } catch (error) {
      console.error('Error fetching report:', error);

      if (retryCount > 0) {
        console.warn(`Retrying... (${3 - retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
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
      
      // Auto redirect after error (except for auth issues)
      if (error.response?.status !== 401) {
        setTimeout(() => navigate('/catalog'), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const retryLoading = async () => {
    setIsRetrying(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay for UX
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

  const handleZoom = (direction) => {
    // Removed zoom functionality
  };

  const resetZoom = () => {
    // Removed zoom reset functionality
  };

  const handlePdfError = () => {
    setPdfLoadError(true);
    showToast('PDF failed to load. Please try refreshing.', 'error');
  };

  // Enhanced loading component
  const LoadingComponent = () => (
    <div className="flex flex-col gap-6 justify-center items-center min-h-[70vh]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full" />
      </div>
      <div className="text-center">
        <p className="text-xl font-semibold text-gray-800 mb-2">Loading PDF Document</p>
        <p className="text-gray-600">Please wait while we securely load your report...</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Shield size={16} />
        <span>Secure viewing mode enabled</span>
      </div>
    </div>
  );

  // Enhanced error component
  const ErrorComponent = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-md mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-red-500 mb-6"
      >
        <AlertTriangle size={64} />
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Document</h2>
      <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={retryLoading}
          disabled={isRetrying}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={isRetrying ? 'animate-spin' : ''} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
        <button
          onClick={() => navigate('/catalog')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Catalog
        </button>
      </div>
    </div>
  );

  // PDF Controls Component
  const PdfControls = () => (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
      {/* Removed Zoom In, Zoom Out, and Reset Zoom buttons */}
      <button
        onClick={toggleFullScreen}
        className="p-2 rounded-md hover:bg-gray-200 transition-colors"
        title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>
    </div>
  );

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ${isFullScreen ? 'fixed inset-0 z-50' : 'pt-16'}`}
      onContextMenu={(e) => e.preventDefault()} // Disable right-click globally
    >
      {/* Main Content */}
      <div 
        ref={containerRef}
        className={`transition-all duration-300 ${
          isFullScreen 
            ? 'w-full h-full bg-gray-900' 
            : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`bg-white rounded-xl shadow-2xl overflow-hidden ${
                  isFullScreen ? 'w-full h-full rounded-none' : 'max-w-6xl mx-auto'
                }`}
              >
                {/* PDF Header */}
                <div className={`p-4 flex justify-between items-center border-b ${
                  isFullScreen ? 'bg-gray-800 text-white' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <h2 className={`text-lg font-bold ${
                      isFullScreen ? 'text-white' : 'text-gray-800'
                    }`}>
                      Report Preview
                    </h2>
                    {!isFullScreen && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Shield size={14} />
                        <span>Protected</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {!isFullScreen && <PdfControls />}
                    
                    {isFullScreen && (
                      <div className="flex items-center gap-2">
                        <PdfControls />
                        <div className="w-px h-6 bg-gray-600 mx-2" />
                        <button
                          onClick={toggleFullScreen}
                          className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-gray-700 transition-colors"
                          title="Exit Fullscreen"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    )}
                    
                    {!isFullScreen && (
                      <button
                        onClick={() => navigate('/catalog')}
                        className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-200 transition-colors"
                        title="Close"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </div>

                {/* PDF Container */}
                <div 
                  className={`relative ${
                    isFullScreen ? 'h-[calc(100vh-80px)]' : 'h-[85vh]'
                  } bg-gray-100`}
                  onContextMenu={(e) => e.preventDefault()} // Disable right-click on PDF container
                >
                  {pdfLoadError ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <AlertTriangle className="text-orange-500 mb-4" size={48} />
                      <p className="text-gray-600 mb-4">PDF failed to load</p>
                      <button
                        onClick={() => {
                          setPdfLoadError(false);
                          setPreviewFileUrl(`${previewFileUrl}&retry=${Date.now()}`);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Retry Loading
                      </button>
                    </div>
                  ) : (
                    <>
                      <embed
                        ref={iframeRef}
                        src={`${previewFileUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=${zoomLevel}`}
                        type="application/pdf"
                        className="w-full h-full transition-transform duration-200"
                        onError={handlePdfError}
                        style={{
                          backgroundColor: '#f8fafc',
                          border: 'none',
                          pointerEvents: 'auto'
                        }}
                      />
                      
                      {/* Overlay for additional security */}
                      <div 
                        className="absolute inset-0 pointer-events-auto"
                        onContextMenu={(e) => e.preventDefault()} // Block right-click on the PDF
                        style={{
                          background: 'transparent',
                        pointerEvents: 'none',
                          userSelect: 'none',
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          msUserSelect: 'none'
                        }}
                      />
                    </>
                  )}
                </div>

                {/* Status Bar */}
                {!isFullScreen && (
                  <div className="px-4 py-2 bg-gray-50 border-t flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Shield size={14} />
                        Secure View
                      </span>
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