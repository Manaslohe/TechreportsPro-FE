import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Trash2, FileText, Calendar, Download, Plus, X, Eye, 
  AlertCircle, Check, ChevronRight, AlertTriangle, Tag, Gift
} from 'lucide-react';
import axios from 'axios';
import Toast from '../common/Toast';
import ReportPreview from './ReportPreview';

const SECTORS = ['Technology', 'Banking', 'Healthcare', 'Energy', 'Market Analysis', 'FMCG', 'Auto'];

const AdminReport = () => {
    const [reports, setReports] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        sector: '',
        isFree: false,
        file: null
    });
    const [filePreview, setFilePreview] = useState(null);
    const [fileNameWarning, setFileNameWarning] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [previewFileUrl, setPreviewFileUrl] = useState(null);
    const [previewReport, setPreviewReport] = useState(null);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

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

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
            const response = await axios.get(`${baseURL}/api/reports`);
            setReports(response.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
            showToast('Failed to fetch reports', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.description || !formData.sector || !formData.file) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        setIsUploading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('sector', formData.sector);
        data.append('isFree', formData.isFree);
        data.append('file', formData.file);

        try {
            const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
            await axios.post(`${baseURL}/api/reports`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsModalOpen(false);
            fetchReports();
            resetForm();
            showToast('Report uploaded successfully', 'success');
        } catch (error) {
            console.error('Error uploading report:', error.response?.data || error.message);
            showToast('Failed to upload report. Please try again.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', sector: '', isFree: false, file: null });
        setFilePreview(null);
        setFileNameWarning(false);
    };

    const handleDelete = async (id) => {
        if (!id) {
            console.error('Invalid report ID for deletion');
            return;
        }

        if (window.confirm('Are you sure you want to delete this report?')) {
            try {
                const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
                await axios.delete(`${baseURL}/api/reports/${id}`);
                fetchReports();
                showToast('Report deleted successfully', 'success');
            } catch (error) {
                console.error('Error deleting report:', error.response?.data || error.message);
                showToast('Failed to delete the report', 'error');
            }
        }
    };

    const showToast = (message, type) => {
        setToast({ isVisible: true, message, type });
        setTimeout(() => setToast({ isVisible: false, message: '', type: 'success' }), 3000);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                showToast('Only PDF files are allowed', 'error');
                return;
            }
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
        if (file && file.type === 'application/pdf') {
            setFormData({ ...formData, file });
            setFilePreview(file.name);
        } else {
            showToast('Only PDF files are allowed', 'error');
        }
    };

    const handlePreview = (reportId, reportTitle) => {
        if (!reportId) {
            console.error('Invalid report ID for preview');
            return;
        }
        const url = `${axios.defaults.baseURL || ''}/api/reports/${reportId}/pdf`;
        setPreviewFileUrl(url);
        setPreviewReport({
            id: reportId,
            title: reportTitle
        });
    };

    const handleClosePreview = () => {
        setPreviewFileUrl(null);
        setPreviewReport(null);
    };

    const handleDownload = async (reportId, title = 'report') => {
        if (!reportId) {
            console.error('Invalid report ID for download');
            return;
        }

        try {
            const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
            const response = await axios.get(`${baseURL}/api/reports/${reportId}/download`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${(title || 'report').replace(/[^a-z0-9_\-]+/gi, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            showToast('Report downloaded successfully', 'success');
        } catch (error) {
            console.error('Error downloading PDF:', error);
            showToast('Failed to download report', 'error');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.07,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50">
            <div className="max-w-7xl mx-auto">
                <Toast
                    isVisible={toast.isVisible}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ isVisible: false, message: '', type: 'success' })}
                />
                
                {/* Add Button */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium shadow-md"
                    >
                        <Plus size={18} />
                        <span>Add New Report</span>
                    </button>
                </motion.div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                        <p className="text-slate-600 font-medium">Loading reports...</p>
                    </div>
                ) : reports.length === 0 ? (
                    // Empty State
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-16 text-center"
                    >
                        <div className="w-20 h-20 mx-auto mb-4 bg-indigo-100 rounded-2xl flex items-center justify-center">
                            <FileText className="text-indigo-600" size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No Reports Available</h3>
                        <p className="text-slate-600 mb-8 max-w-md mx-auto">Upload your first technical report to start building your knowledge base.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium shadow-md"
                        >
                            <Plus size={18} />
                            Add First Report
                        </button>
                    </motion.div>
                ) : (
                    // Reports Grid
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible" 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                        {reports.map((report) => (
                            <ReportCard
                                key={report._id}
                                report={report}
                                onPreview={() => handlePreview(report._id, report.title)}
                                onDownload={() => handleDownload(report._id, report.title)}
                                onDelete={() => handleDelete(report._id)}
                                variants={itemVariants}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Upload Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="p-6 border-b border-slate-200 sticky top-0 bg-white z-10 flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-slate-900">Upload New Report</h2>
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            resetForm();
                                        }}
                                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                                            Report Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm text-slate-900 placeholder-slate-400 transition-all"
                                            placeholder="Enter report title"
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm text-slate-900 placeholder-slate-400 resize-none transition-all"
                                            rows="3"
                                            placeholder="Brief description of the report content"
                                            required
                                        />
                                    </div>

                                    {/* Sector */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                                            Sector <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.sector}
                                            onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm text-slate-900 transition-all"
                                            required
                                        >
                                            <option value="">Select a sector</option>
                                            {SECTORS.map((sector) => (
                                                <option key={sector} value={sector}>{sector}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Free Report Toggle */}
                                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center gap-3">
                                            <Gift className="text-blue-600" size={20} />
                                            <div>
                                                <label className="text-sm font-semibold text-slate-900 cursor-pointer">
                                                    Free Sample Report
                                                </label>
                                                <p className="text-xs text-slate-600 mt-0.5">
                                                    Make this report available to all users for free
                                                </p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.isFree}
                                                onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    {/* File Upload */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                                            PDF File <span className="text-red-500">*</span>
                                        </label>
                                        <div 
                                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                                                isDragging 
                                                    ? 'border-indigo-500 bg-indigo-50' 
                                                    : filePreview 
                                                        ? 'border-emerald-500 bg-emerald-50/50' 
                                                        : 'border-slate-300 hover:border-slate-400'
                                            }`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                        >
                                            {filePreview ? (
                                                <div className="flex items-center justify-center gap-3 py-3">
                                                    <Check className="text-emerald-600 flex-shrink-0" size={20} />
                                                    <span className="text-sm font-medium text-slate-900 truncate max-w-[200px]">
                                                        {filePreview}
                                                    </span>
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({ ...formData, file: null });
                                                            setFilePreview(null);
                                                        }}
                                                        className="p-1 rounded-full hover:bg-red-100 text-red-500 flex-shrink-0 transition-colors"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="py-8">
                                                    <Upload className="mx-auto h-10 w-10 text-slate-400 mb-3" />
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">
                                                            Drag and drop your PDF file here or
                                                        </p>
                                                        <label className="mt-3 inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors">
                                                            Browse Files
                                                            <input
                                                                type="file"
                                                                accept=".pdf"
                                                                onChange={handleFileChange}
                                                                className="hidden"
                                                                required={!formData.file}
                                                            />
                                                        </label>
                                                    </div>
                                                    <p className="mt-2 text-xs text-slate-500">Only PDF files are accepted</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* File name warning */}
                                    {fileNameWarning && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800"
                                        >
                                            <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm">
                                                <p className="font-semibold mb-0.5">Title and filename don't match</p>
                                                <p className="text-xs text-amber-700">
                                                    For better organization, consider making your report title match the PDF filename (without extension).
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-slate-200">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsModalOpen(false);
                                                resetForm();
                                            }}
                                            className="py-2.5 px-5 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isUploading}
                                            className="py-2.5 px-5 bg-gradient-to-r from-indigo-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

                {/* Preview Modal */}
                <AnimatePresence>
                    {previewFileUrl && (
                        <ReportPreview 
                            fileUrl={previewFileUrl}
                            reportTitle={previewReport?.title}
                            onClose={handleClosePreview}
                            onDownload={previewReport ? () => handleDownload(previewReport.id, previewReport.title) : null}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Report Card Component
const ReportCard = ({ report, onPreview, onDownload, onDelete, variants }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        });
    };

    const sectorColors = {
        'Technology': 'bg-blue-100 text-blue-700 border-blue-200',
        'Banking': 'bg-purple-100 text-purple-700 border-purple-200',
        'Healthcare': 'bg-red-100 text-red-700 border-red-200',
        'Energy': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'Market Analysis': 'bg-indigo-100 text-indigo-700 border-indigo-200',
        'FMCG': 'bg-orange-100 text-orange-700 border-orange-200',
        'Auto': 'bg-cyan-100 text-cyan-700 border-cyan-200'
    };

    return (
        <motion.div
            variants={variants}
            className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
        >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-50/50">
                <div className="flex items-start gap-3 mb-3">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm group-hover:shadow-md transition-shadow">
                        <FileText className="text-indigo-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{report.title}</h3>
                    </div>
                </div>
                
                {/* Sector Badge */}
                <div className="flex items-center gap-2">
                    <Tag size={12} className="text-slate-400" />
                    <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border ${sectorColors[report.sector] || sectorColors['Technology']}`}>
                        {report.sector}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="p-5 flex-1">
                <p className="text-slate-600 text-sm line-clamp-3 mb-4">{report.description}</p>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar size={14} />
                    <span>{formatDate(report.uploadDate || report.createdAt)}</span>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
                <button
                    onClick={onPreview}
                    className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group/btn"
                >
                    <Eye size={16} />
                    <span className="hidden sm:inline">Preview</span>
                </button>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onDownload}
                        className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                        title="Download Report"
                    >
                        <Download size={18} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all"
                        title="Delete Report"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminReport;
