import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Download, ExternalLink, FileText, AlertTriangle, FileBadge } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

const ReportPreview = ({ fileUrl, onClose, reportTitle, onDownload }) => {
  const { translate } = useTranslation();
  const [previewError, setPreviewError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previewMethod, setPreviewMethod] = useState('iframe'); // 'iframe', 'object', or 'embed'
  
  // Reset states when fileUrl changes
  useEffect(() => {
    if (fileUrl) {
      setPreviewError(false);
      setIsLoading(true);
      
      // Start with iframe, we'll fall back to other methods if needed
      setPreviewMethod('iframe');
    }
  }, [fileUrl]);

  if (!fileUrl) return null;

  // Handle iframe/object load error
  const handlePreviewError = () => {
    // If iframe failed, try object tag
    if (previewMethod === 'iframe') {
      setPreviewMethod('object');
      return;
    }
    
    // If object failed, try embed tag
    if (previewMethod === 'object') {
      setPreviewMethod('embed');
      return;
    }
    
    // If all methods failed, show error
    setPreviewError(true);
    setIsLoading(false);
  };

  // Handle preview load success
  const handlePreviewLoad = () => {
    setIsLoading(false);
  };

  const renderPreview = () => {
    if (previewError) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg border border-slate-200 p-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <AlertTriangle size={32} className="text-amber-600" />
          </div>
          <h3 className="text-xl font-medium text-slate-800 mb-2">{translate('previewBlocked')}</h3>
          <p className="text-slate-600 text-center mb-6 max-w-md">
            {translate('previewBlockedMessage')}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {onDownload && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload();
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={18} />
                {translate('downloadPdf')}
              </button>
            )}
            <a 
              href={fileUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ExternalLink size={18} />
              {translate('openInNewTab')}
            </a>
          </div>
        </div>
      );
    }

    // Render based on the current preview method
    switch (previewMethod) {
      case 'iframe':
        return (
          <iframe
            src={fileUrl}
            title="PDF Preview"
            className="w-full h-full border border-slate-200 rounded-lg bg-white shadow-sm"
            onError={handlePreviewError}
            onLoad={handlePreviewLoad}
            referrerPolicy="no-referrer"
          />
        );
      case 'object':
        return (
          <object
            data={fileUrl}
            type="application/pdf"
            className="w-full h-full border border-slate-200 rounded-lg bg-white shadow-sm"
            onError={handlePreviewError}
            onLoad={handlePreviewLoad}
          >
            <p className="text-center p-4">
              Unable to display PDF. <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Click here to download</a>
            </p>
          </object>
        );
      case 'embed':
        return (
          <embed
            src={fileUrl}
            type="application/pdf"
            className="w-full h-full border border-slate-200 rounded-lg bg-white shadow-sm"
            onError={handlePreviewError}
            onLoad={handlePreviewLoad}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-6xl h-[95vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-3 sm:p-4 flex justify-between items-center border-b border-slate-200">
          <div className="flex items-center gap-2 overflow-hidden">
            <FileBadge size={20} className="text-blue-600 flex-shrink-0" />
            <h2 className="text-lg font-semibold text-slate-800 truncate">
              {reportTitle ? reportTitle : translate('reportPreview')}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {onDownload && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload();
                }}
                className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                title={translate('downloadReport')}
              >
                <Download size={20} />
              </button>
            )}
            <a 
              href={fileUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              title={translate('openInNewTab')}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={20} />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              title={translate('closePreview')}
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden p-1 sm:p-3 bg-slate-50 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          )}
          
          {renderPreview()}

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full shadow-md text-sm text-slate-600 flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-500" />
            {translate('havingTrouble')} 
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              {translate('openDirectly')}
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReportPreview;
