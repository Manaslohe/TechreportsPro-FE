import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, QrCode, Smartphone, Info, Copy, CheckCircle2, ArrowLeftRight } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from './common/Toast';

const PaymentForm = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isDragging, setIsDragging] = useState(false);
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [viewMode, setViewMode] = useState('qr'); // 'qr' or 'upload'
  
  const UPI_ID = "maxx05@ibl";
  const AMOUNT = 500;
  const DESCRIPTION = "TechReportsPro Report Payment";
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    if (reportId) {
      fetchReportDetails();
    } else {
      setToast({
        show: true,
        message: 'Invalid report ID',
        type: 'error',
      });
      navigate('/catalog');
    }
  }, [reportId]);
  
  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copiedUPI) {
      const timer = setTimeout(() => setCopiedUPI(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedUPI]);

  const fetchReportDetails = async () => {
    try {
      const response = await axios.get(`/api/reports/${reportId}`);
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      setToast({
        show: true,
        message: 'Report not found or has been deleted',
        type: 'error',
      });
      setTimeout(() => navigate('/catalog'), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setToast({
        show: true,
        message: 'Please upload a valid image file',
        type: 'error',
      });
    }
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setToast({
        show: true,
        message: 'Please upload a valid image file',
        type: 'error',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportId || !screenshot) {
      setToast({
        show: true,
        message: 'Please select a screenshot to upload',
        type: 'error'
      });
      return;
    }

    setSubmitting(true);

    try {
      await axios.post('/api/payment-requests', {
        reportId,
        screenshotData: screenshot
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      setToast({
        show: true,
        message: 'Payment proof submitted successfully! Awaiting verification.',
        type: 'success',
      });

      setTimeout(() => navigate('/catalog'), 2000);
    } catch (error) {
      const errorMessage = {
        'SCREENSHOT_REQUIRED': 'Payment screenshot is required',
        'AUTH_REQUIRED': 'Please login to continue',
        'TOKEN_EXPIRED': 'Session expired. Please login again',
        'DUPLICATE_REQUEST': 'You already have a pending request for this report',
        'ALREADY_PURCHASED': 'You have already purchased this report',
        'REPORT_NOT_FOUND': 'Report not found',
      }[error.response?.data?.code] || 'Error submitting payment';

      setToast({
        show: true,
        message: errorMessage,
        type: 'error',
      });

      if (['AUTH_REQUIRED', 'TOKEN_EXPIRED'].includes(error.response?.data?.code)) {
        setTimeout(() => navigate('/signin'), 2000);
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUPI(true);
    setToast({
      show: true,
      message: 'UPI ID copied to clipboard',
      type: 'success',
    });
  };
  
  const openUpiApp = () => {
    // Format UPI deep link
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=TechReportsPro&am=${AMOUNT}&cu=INR&tn=${encodeURIComponent(DESCRIPTION)}`;
    window.location.href = upiUrl;
  };
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'qr' ? 'upload' : 'qr');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pt-16 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
            <h2 className="text-xl md:text-2xl font-bold">Complete Your Purchase</h2>
            <p className="mt-1 text-blue-100 text-sm md:text-base">Simple 2-step process to access your report</p>
          </div>
          
          {/* Report Details */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{report?.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Price: ₹{AMOUNT}</p>
              </div>
            </div>
          </div>

          {/* Payment Process Section */}
          <div className="p-6">
            {/* Steps */}
            <div className="mb-6">
              <div className="flex justify-between mb-4">
                <button 
                  onClick={() => setViewMode('qr')}
                  className={`flex-1 py-3 text-center font-medium rounded-l-lg transition-colors ${
                    viewMode === 'qr' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <QrCode size={18} />
                    <span className="hidden sm:inline">Step 1: Pay</span>
                    <span className="inline sm:hidden">Pay</span>
                  </span>
                </button>
                <button 
                  onClick={() => setViewMode('upload')}
                  className={`flex-1 py-3 text-center font-medium rounded-r-lg transition-colors ${
                    viewMode === 'upload' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Upload size={18} />
                    <span className="hidden sm:inline">Step 2: Upload Proof</span>
                    <span className="inline sm:hidden">Upload</span>
                  </span>
                </button>
              </div>
            </div>
            
            {viewMode === 'qr' ? (
              <div className="flex flex-col md:flex-row md:items-center gap-6 p-2">
                {/* QR Code Section */}
                <div className="flex-1 flex justify-center">
                  <div className="relative group">
                    <div className="bg-white p-2.5 rounded-xl border-2 border-gray-200 shadow-sm">
                      <img 
                        src="/QR.jpeg" 
                        alt="Payment QR Code" 
                        className="w-full max-w-[220px] h-auto cursor-pointer"
                        onClick={isMobile ? openUpiApp : undefined}
                      />
                    </div>
                    {isMobile && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-xl">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-sm py-1.5 px-3 rounded-full shadow-lg flex items-center gap-1.5">
                          <Smartphone size={16} />
                          Tap to pay
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Payment Info */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 text-lg">How to Pay:</h4>
                    
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Amount to Pay</p>
                        <p className="font-semibold text-lg text-gray-900">₹{AMOUNT}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">UPI ID (for payment)</p>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-sm font-medium bg-gray-100 px-2.5 py-1.5 rounded text-gray-800">
                            {UPI_ID}
                          </code>
                          <button 
                            onClick={copyUpiId}
                            className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                            title="Copy UPI ID"
                          >
                            {copiedUPI ? 
                              <CheckCircle2 size={18} className="text-green-600" /> : 
                              <Copy size={18} className="text-gray-500" />
                            }
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {isMobile && (
                      <button 
                        onClick={openUpiApp}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Smartphone size={18} />
                        Pay Using UPI App
                      </button>
                    )}
                    
                    <div className="flex items-start gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-700">Simple Steps:</p>
                        <ol className="list-decimal ml-4 mt-1 space-y-1">
                          <li>Scan QR code with any UPI app</li>
                          <li>Pay ₹{AMOUNT}</li>
                          <li>Take a screenshot of payment confirmation</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile-optimized button */}
                  <div className="pt-2 sm:pt-4">
                    <button 
                      onClick={toggleViewMode}
                      className="w-full py-3.5 sm:py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 hover:bg-blue-700 shadow-sm text-sm sm:text-base"
                    >
                      <Upload size={isMobile ? 16 : 18} className="flex-shrink-0" />
                      <span className="truncate">Continue to Upload Payment Screenshot</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Your Payment Screenshot:
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : screenshot
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {screenshot ? (
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={screenshot}
                          alt="Uploaded Screenshot"
                          className="max-w-full max-h-[240px] object-contain rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setScreenshot(null)}
                          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium"
                        >
                          Remove Screenshot
                        </button>
                      </div>
                    ) : (
                      <div className="py-6">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-sm font-medium text-gray-700 mt-2">
                          Click below to select a screenshot or drag and drop it here
                        </p>
                        <label className="mt-3 inline-block px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                          Select Screenshot from Device
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotChange}
                            className="hidden"
                          />
                        </label>
                        <p className="mt-2 text-xs text-gray-500">Any image format is accepted (JPG, PNG, etc.)</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start gap-2">
                    <Info size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-700">
                      Please upload a screenshot showing your payment confirmation with transaction details
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={toggleViewMode}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all flex-1 md:flex-none"
                  >
                    Back to Payment QR
                  </button>
                  
                  <button
                    type="submit"
                    disabled={submitting || !screenshot}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        <span>Submit Payment Proof</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
          
          {/* Footer with help text */}
          <div className="bg-gray-50 p-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 text-center">
              Need help? Contact our support team at <a href="mailto:support@techreportspro.com" className="text-blue-600 hover:underline">support@techreportspro.com</a>
            </p>
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

export default PaymentForm;
