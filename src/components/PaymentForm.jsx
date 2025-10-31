import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, QrCode, Smartphone, Info, Copy, CheckCircle2, ArrowLeftRight, Calendar, Star } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Toast from './common/Toast';
import { useTranslation } from '../contexts/TranslationContext';

const PaymentForm = () => {
  const { type, id } = useParams(); // type: 'report' or 'plan', id: reportId or planId
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useTranslation();
  
  const [report, setReport] = useState(null);
  const [plan, setPlan] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isDragging, setIsDragging] = useState(false);
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [viewMode, setViewMode] = useState('qr');
  
  const UPI_ID = "marketmindsresearch@ibl";
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Plan definitions (should match PlanSelection.jsx)
  const planDefinitions = {
    basic: {
      id: 'basic',
      name: 'Basic',
      price: 355,
      period: 'month',
      duration: 1,
      totalReports: 7,
      premiumReports: 6,
      bluechipReports: 1
    },
    plus: {
      id: 'plus',
      name: 'Plus',
      price: 855,
      period: '3 months',
      duration: 3,
      totalReports: 21,
      premiumReports: 18,
      bluechipReports: 3
    },
    pro: {
      id: 'pro',
      name: 'Pro',
      price: 1255,
      period: '6 months',
      duration: 6,
      totalReports: 42,
      premiumReports: 36,
      bluechipReports: 6
    },
    elite: {
      id: 'elite',
      name: 'Elite',
      price: 2555,
      period: 'yearly',
      duration: 12,
      totalReports: 84,
      premiumReports: 72,
      bluechipReports: 12
    }
  };

  useEffect(() => {
    if (type === 'report' && id) {
      fetchReportDetails();
    } else if (type === 'plan' && id) {
      setPlanDetails();
    } else {
      setToast({
        show: true,
        message: 'Invalid payment request',
        type: 'error',
      });
      navigate('/catalog');
    }
  }, [type, id]);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copiedUPI) {
      const timer = setTimeout(() => setCopiedUPI(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedUPI]);

  const fetchReportDetails = async () => {
    try {
      const response = await axios.get(`/api/reports/${id}`);
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

  const setPlanDetails = () => {
    const selectedPlan = location.state?.plan || planDefinitions[id];
    if (selectedPlan) {
      setPlan(selectedPlan);
    } else {
      setToast({
        show: true,
        message: 'Plan not found',
        type: 'error',
      });
      navigate('/plans');
    }
    setLoading(false);
  };

  const getAmount = () => {
    if (type === 'report') return 555;
    if (type === 'plan' && plan) return plan.price;
    return 0;
  };

  const getDescription = () => {
    if (type === 'report') return "TechReportsPro Individual Report";
    if (type === 'plan' && plan) return `TechReportsPro ${plan.name} Plan Purchase`;
    return "TechReportsPro Payment";
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
        message: translate('uploadValidImage'),
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
        message: translate('uploadValidImage'),
        type: 'error',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!screenshot) {
      setToast({
        show: true,
        message: translate('selectScreenshotToUpload'),
        type: 'error'
      });
      return;
    }

    setSubmitting(true);

    try {
      // Map 'plan' type to 'subscription' for backend
      const backendPaymentType = type === 'plan' ? 'subscription' : type;
      
      const payloadData = {
        paymentType: backendPaymentType, // Changed from: paymentType: type
        amount: getAmount(),
        screenshotData: screenshot
      };

      if (type === 'report') {
        payloadData.reportId = id;
      } else if (type === 'plan') {
        payloadData.subscriptionPlan = {
          planId: plan.id,
          planName: plan.name,
          duration: plan.duration,
          reportsIncluded: plan.totalReports,
          premiumReports: plan.premiumReports,
          bluechipReports: plan.bluechipReports
        };
      }

      await axios.post('/api/payment-requests', payloadData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      const successMessage = type === 'plan' 
        ? translate('planPaymentSuccess', { planName: plan.name })
        : translate('reportPaymentSuccess');

      setToast({
        show: true,
        message: successMessage,
        type: 'success',
      });

      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      const errorCode = error.response?.data?.code;
      const errorMessages = {
        'SCREENSHOT_REQUIRED': translate('screenshotRequired'),
        'AUTH_REQUIRED': translate('authRequired'),
        'TOKEN_EXPIRED': translate('tokenExpired'),
        'DUPLICATE_REQUEST': translate('duplicateRequest'),
        'ALREADY_PURCHASED': translate('alreadyPurchased'),
        'ITEM_NOT_FOUND': translate('itemNotFound'),
        'ACTIVE_SUBSCRIPTION': translate('activeSubscription')
      };

      setToast({
        show: true,
        message: errorMessages[errorCode] || translate('errorSubmittingPayment'),
        type: 'error',
      });

      if (['AUTH_REQUIRED', 'TOKEN_EXPIRED'].includes(errorCode)) {
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
      message: translate('upiIdCopied'),
      type: 'success',
    });
  };
  
  const openUpiApp = () => {
    // Format UPI deep link
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=TechReportsPro&am=${getAmount()}&cu=INR&tn=${encodeURIComponent(getDescription())}`;
    window.location.href = upiUrl;
  };
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'qr' ? 'upload' : 'qr');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!report && !plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
            <h2 className="text-xl md:text-2xl font-bold">{translate('completePurchase')}</h2>
            <p className="mt-1 text-blue-100 text-sm md:text-base">
              {type === 'plan' ? translate('subscriptionPlanPayment') : translate('individualReportPayment')}
            </p>
          </div>
          
          {/* Item Details */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 flex-shrink-0">
                {type === 'plan' ? <Star className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {type === 'plan' ? `${plan?.name} ${translate('planBasic')}` : report?.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {translate('price')}: ₹{getAmount()}
                  {type === 'plan' && (
                    <span className="ml-2">• {plan?.totalReports} {translate('reportsIncluded')} • {translate('validFor')} {plan?.period}</span>
                  )}
                </p>
                {type === 'plan' && (
                  <div className="mt-2 text-sm text-blue-600">
                    {translate('premiumReportsCount', { count: plan?.premiumReports })} + {translate('bluechipReportsCount', { count: plan?.bluechipReports })}
                  </div>
                )}
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
                    <span className="hidden sm:inline">{translate('step1Pay')}</span>
                    <span className="inline sm:hidden">{translate('pay')}</span>
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
                    <span className="hidden sm:inline">{translate('step2Upload')}</span>
                    <span className="inline sm:hidden">{translate('uploadProof')}</span>
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
                          {translate('tapToPay')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Payment Info */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 text-lg">{translate('howToPay')}</h4>
                    
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">{translate('amountToPay')}</p>
                        <p className="font-semibold text-lg text-gray-900">₹{getAmount()}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">{translate('upiIdForPayment')}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-sm font-medium bg-gray-100 px-2.5 py-1.5 rounded text-gray-800">
                            {UPI_ID}
                          </code>
                          <button 
                            onClick={copyUpiId}
                            className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                            title={translate('copyUpiId')}
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
                        {translate('payUsingUpiApp')}
                      </button>
                    )}
                    
                    <div className="flex items-start gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-700">{translate('simpleSteps')}</p>
                        <ol className="list-decimal ml-4 mt-1 space-y-1">
                          <li>{translate('scanQrCode')}</li>
                          <li>{translate('payAmount', { amount: getAmount() })}</li>
                          <li>{translate('takeScreenshot')}</li>
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
                      <span className="truncate">{translate('continueToUpload')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translate('uploadPaymentScreenshot')}
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
                          alt={translate('uploadedScreenshot')}
                          className="max-w-full max-h-[240px] object-contain rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setScreenshot(null)}
                          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium"
                        >
                          {translate('removeScreenshot')}
                        </button>
                      </div>
                    ) : (
                      <div className="py-6">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-sm font-medium text-gray-700 mt-2">
                          {translate('clickToSelect')}
                        </p>
                        <label className="mt-3 inline-block px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                          {translate('selectScreenshot')}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotChange}
                            className="hidden"
                          />
                        </label>
                        <p className="mt-2 text-xs text-gray-500">{translate('anyImageFormat')}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start gap-2">
                    <Info size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-700">
                      {translate('uploadScreenshotNote')}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={toggleViewMode}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all flex-1 md:flex-none"
                  >
                    {translate('backToPaymentQr')}
                  </button>
                  
                  <button
                    type="submit"
                    disabled={submitting || !screenshot}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{translate('processing')}</span>
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        <span>{translate('submitPaymentProof')}</span>
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
              {translate('needHelp')} <a href="mailto:info.marketmindsresearch@gmail.com" className="text-blue-600 hover:underline">info.marketmindsresearch@gmail.com</a>
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
