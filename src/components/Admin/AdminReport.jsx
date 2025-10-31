import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Trash2, FileText, Calendar, Download, Plus, X, Eye, 
  AlertCircle, Check, ChevronRight, AlertTriangle, Tag, Gift
} from 'lucide-react';
import axios from 'axios';
import Toast from '../common/Toast';
import ReportPreview from './ReportPreview';
import ReportUploadForm from './ReportUploadForm';

const SECTORS = ['Technology', 'Banking', 'Healthcare', 'Energy', 'Market Analysis', 'FMCG', 'Auto'];

const AdminReport = () => {
    const [reports, setReports] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [previewFileUrl, setPreviewFileUrl] = useState(null);
    const [previewReport, setPreviewReport] = useState(null);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

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

    const handleSubmit = async (formData) => {
        setIsUploading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('sector', formData.sector);
        data.append('isFree', formData.isFree);
        data.append('uploadDate', formData.uploadDate); // Add uploadDate
        data.append('file', formData.file);

        try {
            const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
            await axios.post(`${baseURL}/api/reports`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsModalOpen(false);
            fetchReports();
            showToast('Report uploaded successfully', 'success');
        } catch (error) {
            console.error('Error uploading report:', error.response?.data || error.message);
            showToast('Failed to upload report. Please try again.', 'error');
        } finally {
            setIsUploading(false);
        }
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
                <ReportUploadForm
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    isSubmitting={isUploading}
                />

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
