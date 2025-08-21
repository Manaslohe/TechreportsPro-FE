import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ isVisible, message, type = 'success', onClose }) => {
  const icons = {
    success: <CheckCircle className="w-6 h-6" />,
    error: <AlertCircle className="w-6 h-6" />,
  };

  const colors = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 2000); // Auto-dismiss after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div
            className={`rounded-lg border p-4 shadow-md flex items-center gap-4 ${colors[type]}`}
          >
            {icons[type]}
            <p className="font-medium flex-1">{message}</p>
            <button
              onClick={onClose}
              className="hover:opacity-70 transition-opacity"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
