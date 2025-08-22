import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Trash2, FileText, Calendar, Download, Plus, X, Eye, 
  AlertCircle, Info, Check, ChevronRight, AlertTriangle, ClipboardCheck
} from 'lucide-react';
import axios from 'axios';
import Toast from '../common/Toast';
import ReportPreview from './ReportPreview';

const AdminReport = () => {
    const [reports, setReports] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
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

    // Check if file name and title match
    useEffect(() => {
        if (formData.file && formData.title) {
            const fileName = formData.file.name.replace(/\.[^/.]+$/, ""); // Remove extension
            const formattedTitle = formData.title.trim().toLowerCase().replace(/\s+/g, '_');
            const formattedFileName = fileName.toLowerCase().replace(/\s+/g, '_');
            
            // If they don't approximately match, show warning
            setFileNameWarning(formattedFileName !== formattedTitle);
        } else {
            setFileNameWarning(false);
        }
    }, [formData.file, formData.title]);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/reports');
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
        
        if (!formData.title || !formData.description || !formData.file) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        setIsUploading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('file', formData.file);

        try {
            await axios.post('/api/upload', data, {
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
        setFormData({ title: '', description: '', file: null });
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
                await axios.delete(`/api/reports/${id}`);
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
        const url = `${axios.defaults.baseURL || ''}/api/pdf/${reportId}?mode=inline`;
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
            const response = await axios.get(`/api/pdf/${reportId}?download=1`, {
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
        <div className="p-4 md:p-6 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <Toast
                    isVisible={toast.isVisible}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ isVisible: false, message: '', type: 'success' })}
                />
                
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
                >
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Reports Management</h1>
                        <p className="text-slate-500 mt-1">Upload and manage technical reports</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
                    >
                        <Plus size={18} />
                        Add New Report
                    </button>
                </motion.div>

                {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-500">Loading reports...</p>
                    </div>
                ) : reports.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center"
                    >
                        <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                            <FileText className="text-slate-400" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">No Reports Available</h3>
                        <p className="text-slate-500 mb-6 max-w-md mx-auto">Upload your first technical report to start building your knowledge base.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Plus size={18} />
                            Add First Report
                        </button>
                    </motion.div>
                ) : (
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
                                className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="p-5 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-slate-800">Upload New Report</h2>
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            resetForm();
                                        }}
                                        className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="p-5">
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Report Title <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm text-slate-800"
                                                placeholder="Enter report title"
                                                required
                                            />
                                            <p className="mt-1.5 text-xs font-medium text-red-500">
                                                The title should match your PDF file name for better organization.
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Description <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm text-slate-800 resize-none"
                                                rows="3"
                                                placeholder="Brief description of the report content"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                PDF File <span className="text-red-500">*</span>
                                            </label>
                                            <div 
                                                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                                                    isDragging 
                                                        ? 'border-blue-500 bg-blue-50' 
                                                        : filePreview 
                                                            ? 'border-green-500 bg-green-50/50' 
                                                            : 'border-slate-300 hover:border-slate-400'
                                                }`}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                            >
                                                {filePreview ? (
                                                    <div className="flex items-center justify-center gap-2 py-2">
                                                        <FileText className="text-green-600 flex-shrink-0" size={20} />
                                                        <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                                                            {filePreview}
                                                        </span>
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({ ...formData, file: null });
                                                                setFilePreview(null);
                                                            }}
                                                            className="p-1 rounded-full hover:bg-red-100 text-red-500 flex-shrink-0"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="py-6">
                                                        <Upload className="mx-auto h-10 w-10 text-slate-400" />
                                                        <div className="mt-2">
                                                            <p className="text-sm font-medium text-slate-700">
                                                                Drag and drop your PDF file here or
                                                            </p>
                                                            <label className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
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
                                                        <p className="mt-1 text-xs text-slate-500">Only PDF files are accepted</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* File name warning alert */}
                                        {fileNameWarning && (
                                            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                                                <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                                <div className="text-sm">
                                                    <p className="font-medium mb-1">Title and filename don't match</p>
                                                    <p className="text-xs text-amber-700">
                                                        For better organization, consider making your report title match the PDF filename (without the extension).
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsModalOpen(false);
                                                resetForm();
                                            }}
                                            className="py-2.5 px-4 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isUploading}
                                            className="py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload size={16} />
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

// Separate Report Card component for better organization
const ReportCard = ({ report, onPreview, onDownload, onDelete, variants }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        });
    };

    return (
        <motion.div
            variants={variants}
            className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
        >
            <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-md shadow-sm border border-slate-200">
                        <FileText className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-800 truncate">{report.title}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <Calendar size={12} />
                            <span>{formatDate(report.uploadDate || report.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-4 flex-1">
                <p className="text-slate-600 text-sm line-clamp-3">{report.description}</p>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                    <button
                        onClick={onPreview}
                        className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <Eye size={15} />
                        Preview
                    </button>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onDownload}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                            title="Download Report"
                        >
                            <Download size={16} />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-1.5 rounded-md hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
                            title="Delete Report"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminReport;
               