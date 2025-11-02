import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Upload, Check, AlertTriangle, Calendar as CalendarIcon,
  FileText, Tag, Gift, Info, AlertCircle, Crown, Gem, Sparkles
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReportUploadForm = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sector: '',
    reportType: 'premium',
    uploadDate: new Date(),
    file: null
  });
  const [filePreview, setFilePreview] = useState(null);
  const [fileNameWarning, setFileNameWarning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (formData.file && formData.title) {
      const fileName = formData.file.name.replace(/\.[^/.]+$/, "");
      const formattedTitle = formData.title.trim().toLowerCase().replace(/\s+/g, '_');
      const formattedFileName = fileName.toLowerCase().replace(/\s+/g, '_');
      setFileNameWarning(formattedFileName !== formattedTitle);
    } else {
      setFileNameWarning(false);
    }
  }, [formData.file, formData.title]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      sector: '',
      reportType: 'premium',
      uploadDate: new Date(),
      file: null
    });
    setFilePreview(null);
    setFileNameWarning(false);
    setIsDragging(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      uploadDate: formData.uploadDate.toISOString().split('T')[0]
    };
    await onSubmit(submitData);
    resetForm();
  };

  const handleFileChange = (file) => {
    if (file && file.type === 'application/pdf') {
      setFormData({ ...formData, file });
      setFilePreview(file.name);
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
    handleFileChange(file);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="payment-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            key="payment-modal-content"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/10" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Upload New Report</h2>
                    <p className="text-indigo-100 text-sm mt-0.5">Fill in the details to publish a report</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Title & Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title Field */}
                <div key="title-field">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <FileText size={16} className="text-indigo-600" />
                    Report Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400"
                    placeholder="e.g., Tech_Mahindra_Q3_Analysis"
                    required
                  />
                  <div className="mt-2 flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 leading-tight">
                      Title must match PDF filename exactly
                    </p>
                  </div>
                </div>

                {/* Date Picker Field */}
                <div key="date-field">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <CalendarIcon size={16} className="text-indigo-600" />
                    Upload Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={formData.uploadDate}
                      onChange={(date) => setFormData({ ...formData, uploadDate: date })}
                      maxDate={new Date()}
                      dateFormat="dd/MM/yyyy"
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 cursor-pointer"
                      placeholderText="Select date"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      calendarClassName="shadow-2xl border-2 border-indigo-200"
                      wrapperClassName="w-full"
                      popperClassName="z-50"
                      required
                    />
                    <CalendarIcon 
                      size={18} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" 
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                    <Info size={11} />
                    Report's publication date
                  </p>
                </div>
              </div>

              {/* Description */}
              <div key="description-field">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Info size={16} className="text-indigo-600" />
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400 resize-none"
                  rows="3"
                  placeholder="Brief overview of the report content, key insights, and target audience..."
                  required
                />
              </div>

              {/* Sector Text Input */}
              <div key="sector-field">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Tag size={16} className="text-indigo-600" />
                  Sector <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400"
                  placeholder="e.g., Technology, Banking, Healthcare"
                  required
                />
              </div>

              {/* Report Type Selector */}
              <div key="report-type-field">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                  <Sparkles size={16} className="text-indigo-600" />
                  Report Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Premium Option */}
                  <button
                    key="premium-btn"
                    type="button"
                    onClick={() => setFormData({ ...formData, reportType: 'premium' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.reportType === 'premium'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <Crown className={`w-6 h-6 mx-auto mb-2 ${
                      formData.reportType === 'premium' ? 'text-blue-600' : 'text-slate-400'
                    }`} />
                    <p className={`text-sm font-semibold ${
                      formData.reportType === 'premium' ? 'text-blue-600' : 'text-slate-600'
                    }`}>
                      Premium
                    </p>
                    <p className="text-xs text-slate-500 mt-1">₹555</p>
                  </button>

                  {/* Bluechip Option */}
                  <button
                    key="bluechip-btn"
                    type="button"
                    onClick={() => setFormData({ ...formData, reportType: 'bluechip' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.reportType === 'bluechip'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <Gem className={`w-6 h-6 mx-auto mb-2 ${
                      formData.reportType === 'bluechip' ? 'text-purple-600' : 'text-slate-400'
                    }`} />
                    <p className={`text-sm font-semibold ${
                      formData.reportType === 'bluechip' ? 'text-purple-600' : 'text-slate-600'
                    }`}>
                      Bluechip
                    </p>
                    <p className="text-xs text-slate-500 mt-1">₹555</p>
                  </button>

                  {/* Free Option */}
                  <button
                    key="free-btn"
                    type="button"
                    onClick={() => setFormData({ ...formData, reportType: 'free' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.reportType === 'free'
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-200 hover:border-green-300'
                    }`}
                  >
                    <Gift className={`w-6 h-6 mx-auto mb-2 ${
                      formData.reportType === 'free' ? 'text-green-600' : 'text-slate-400'
                    }`} />
                    <p className={`text-sm font-semibold ${
                      formData.reportType === 'free' ? 'text-green-600' : 'text-slate-600'
                    }`}>
                      Free
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Sample</p>
                  </button>
                </div>
              </div>

              {/* File Upload */}
              <div key="file-upload-field">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Upload size={16} className="text-indigo-600" />
                  PDF File <span className="text-red-500">*</span>
                </label>
                <div 
                  className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
                    isDragging 
                      ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
                      : filePreview 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {filePreview ? (
                    <div className="flex items-center justify-center gap-3 py-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Check className="text-emerald-600" size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{filePreview}</p>
                        <p className="text-xs text-slate-500 mt-0.5">PDF ready for upload</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, file: null });
                          setFilePreview(null);
                        }}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="mx-auto w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                        <Upload className="h-7 w-7 text-indigo-600" />
                      </div>
                      <p className="text-sm font-medium text-slate-900 mb-2">
                        Drag & drop PDF here
                      </p>
                      <p className="text-xs text-slate-500 mb-3">or</p>
                      <label className="inline-block px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">
                        Browse Files
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleFileChange(e.target.files[0])}
                          className="hidden"
                          required={!formData.file}
                        />
                      </label>
                      <p className="mt-2 text-xs text-slate-500">PDF only (Max 50MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Filename Mismatch Warning */}
              <AnimatePresence>
                {fileNameWarning && (
                  <motion.div
                    key="filename-warning"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2 p-3 bg-amber-50 border-2 border-amber-200 rounded-xl"
                  >
                    <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-amber-900">Mismatch detected</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        Rename PDF to: <code className="px-1.5 py-0.5 bg-amber-100 rounded text-amber-800 font-mono text-xs">
                          {formData.title.trim().toLowerCase().replace(/\s+/g, '_')}.pdf
                        </code>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Actions */}
              <div key="form-actions" className="flex flex-col sm:flex-row gap-3 pt-3 border-t-2 border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 sm:flex-none px-6 py-2.5 border-2 border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Upload Report
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportUploadForm;

/* Custom DatePicker Styles */
<style jsx global>{`
  .react-datepicker {
    font-family: inherit;
    border-radius: 16px;
    border: 2px solid #e2e8f0;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  .react-datepicker__header {
    background-color: #4f46e5;
    border-bottom: none;
    border-radius: 14px 14px 0 0;
    padding-top: 12px;
  }
  .react-datepicker__current-month,
  .react-datepicker__day-name {
    color: white;
    font-weight: 600;
  }
  .react-datepicker__day {
    border-radius: 8px;
    transition: all 0.2s;
  }
  .react-datepicker__day:hover {
    background-color: #eef2ff;
    color: #4f46e5;
  }
  .react-datepicker__day--selected {
    background-color: #4f46e5;
    color: white;
    font-weight: 600;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: #818cf8;
  }
  .react-datepicker__day--disabled {
    color: #cbd5e1;
  }
  .react-datepicker__triangle {
    display: none;
  }
`}</style>
