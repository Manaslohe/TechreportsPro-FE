import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, FileText, Calendar, Download, Plus, X, Eye, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Toast from '../common/Toast'; // Import the Toast component

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
    const [isDragging, setIsDragging] = useState(false);
    const [previewFileUrl, setPreviewFileUrl] = useState(null); // State for preview modal
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' }); // Toast state

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axios.get('/api/reports');
            setReports(response.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        if (!formData.title || !formData.description || !formData.file) {
            alert('Please fill in all fields and upload a PDF file.');
            setIsUploading(false);
            return;
        }
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('file', formData.file);

        try {
            // Store PDF buffer in DB
            await axios.post('/api/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsModalOpen(false);
            fetchReports();
            resetForm();
            showToast('PDF uploaded successfully!', 'success'); // Show success toast
        } catch (error) {
            console.error('Error uploading report:', error.response?.data || error.message);
            showToast('Failed to upload PDF. Please try again.', 'error'); // Show error toast
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', file: null });
        setFilePreview(null);
    };

    const handleDelete = async (id) => {
        if (!id) {
            console.error('Invalid report ID for deletion');
            return;
        }

        if (window.confirm('Are you sure you want to delete this report?')) {
            try {
                await axios.delete(`/api/reports/${id}`);
                fetchReports(); // Refresh the list after deletion
                showToast('PDF deleted successfully!', 'success'); // Show success toast
            } catch (error) {
                console.error('Error deleting report:', error.response?.data || error.message);
                showToast('Failed to delete the report. Please try again.', 'error'); // Show error toast
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
            alert('Please upload a PDF file');
        }
    };

    const handlePreview = (reportId) => {
        if (!reportId) {
            console.error('Invalid report ID for preview');
            return;
        }
        // Use absolute backend URL and inline mode to ensure it opens in iframe
        setPreviewFileUrl(`${axios.defaults.baseURL}/api/pdf/${reportId}?mode=inline`);
    };

    const handleDownload = async (reportId, title = 'report') => {
        if (!reportId) {
            console.error('Invalid report ID for download');
            return;
        }

        try {
            const response = await axios.get(`/api/pdf/${reportId}?download=1`, {
                responseType: 'blob', // Ensure the response is treated as a binary file
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${(title || 'report').replace(/[^a-z0-9_\-]+/gi, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <Toast
                    isVisible={toast.isVisible}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ isVisible: false, message: '', type: 'success' })}
                />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Reports Management</h1>
                        <p className="text-gray-500 mt-1">Upload and manage technical reports</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
                    >
                        <Plus size={20} />
                        Add New Report
                    </button>
                </div>

                {reports.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <FileText className="text-gray-400" size={48} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Reports Available</h3>
                        <p className="text-gray-500 mb-6">Upload your first report to get started</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={18} />
                            Add Report
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reports.map((report) => (
                            <motion.div
                                key={report._id} // Ensure unique key
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="bg-blue-50 p-4 border-b flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <FileText className="text-blue-600" size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-800 truncate">{report.title}</h3>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                            <Calendar size={12} />
                                            <span>{new Date(report.uploadDate).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-4">
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{report.description}</p>
                                    
                                    <div className="flex items-center justify-between mt-4">
                                        <button
                                            onClick={() => handlePreview(report._id)} // Pass correct report ID
                                            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <Eye size={16} />
                                            View Report
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDownload(report._id, report.title)}
                                                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
                                                title="Download"
                                            >
                                                <Download size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(report._id)}
                                                className="p-1.5 rounded-full hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-auto"
                            >
                                <div className="p-6 border-b sticky top-0 bg-white z-10">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold text-gray-800">Upload New Report</h2>
                                        <button
                                            onClick={() => {
                                                setIsModalOpen(false);
                                                resetForm();
                                            }}
                                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="p-6">
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Report Title*
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                placeholder="Enter report title"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Description*
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                rows="3"
                                                placeholder="Brief description of the report"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                PDF File*
                                            </label>
                                            <div 
                                                className={`border-2 border-dashed rounded-lg p-4 text-center ${
                                                    isDragging 
                                                        ? 'border-blue-500 bg-blue-50' 
                                                        : filePreview 
                                                            ? 'border-green-500 bg-green-50' 
                                                            : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                            >
                                                {filePreview ? (
                                                    <div className="flex items-center justify-center gap-2 py-2">
                                                        <FileText className="text-green-600" size={24} />
                                                        <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                                            {filePreview}
                                                        </span>
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({ ...formData, file: null });
                                                                setFilePreview(null);
                                                            }}
                                                            className="p-1 rounded-full hover:bg-red-100 text-red-500"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="py-4">
                                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                        <div className="mt-2">
                                                            <p className="text-sm font-medium text-gray-700">
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
                                                        <p className="mt-1 text-xs text-gray-500">Only PDF files are accepted</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsModalOpen(false);
                                                resetForm();
                                            }}
                                            className="py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isUploading}
                                            className="py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {isUploading ? (
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

                <AnimatePresence>
                    {previewFileUrl && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
                            >
                                <div className="p-4 flex justify-between items-center border-b">
                                    <h2 className="text-lg font-bold text-gray-800">Report Preview</h2>
                                    <button
                                        onClick={() => setPreviewFileUrl(null)}
                                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <iframe
                                        src={previewFileUrl}
                                        title="PDF Preview"
                                        className="w-full h-[70vh] border rounded-lg"
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminReport;
