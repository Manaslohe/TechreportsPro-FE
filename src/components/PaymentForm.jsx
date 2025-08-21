import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from './common/Toast';

const PaymentForm = () => {
  const { reportId } = useParams(); // Ensure reportId is retrieved from URL params
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isDragging, setIsDragging] = useState(false); // State for drag-and-drop

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
        setScreenshot(reader.result); // Store base64 string
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
        setScreenshot(reader.result); // Store base64 string
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
        screenshotData: screenshot // Ensure screenshotData is sent
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!report) {
    return null; // Prevent rendering if the report is not found
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pt-24">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Purchase</h2>

          {/* Report Details */}
          <div className="mb-8 p-6 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white rounded-xl text-blue-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{report?.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Amount: ₹500</p>
              </div>
            </div>
            <p className="text-gray-600">{report?.description}</p>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Payment Screenshot
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center ${
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
                      className="max-w-full h-40 object-contain rounded-lg"
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
                  <div className="py-4">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700 mt-2">
                      Drag and drop your image here or
                    </p>
                    <label className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                      Browse Files
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="hidden"
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">Only image files are accepted</p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !screenshot}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Upload size={20} />
                  Submit Payment Proof
                </>
              )}
            </button>
          </form>
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
