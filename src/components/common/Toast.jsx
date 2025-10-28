import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ isVisible, message, type = 'success', onClose }) => {
  const toastConfig = {
    success: {
      bg: 'bg-white',
      border: 'border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      textColor: 'text-gray-900',
      shadow: 'shadow-lg shadow-green-100/50'
    },
    error: {
      bg: 'bg-white',
      border: 'border-red-200',
      icon: AlertCircle,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      textColor: 'text-gray-900',
      shadow: 'shadow-lg shadow-red-100/50'
    },
    info: {
      bg: 'bg-white',
      border: 'border-blue-200',
      icon: Info,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      textColor: 'text-gray-900',
      shadow: 'shadow-lg shadow-blue-100/50'
    },
    warning: {
      bg: 'bg-white',
      border: 'border-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
      textColor: 'text-gray-900',
      shadow: 'shadow-lg shadow-amber-100/50'
    },
  };

  const config = toastConfig[type] || toastConfig.info;
  const Icon = config.icon;

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ 
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
          className={`fixed bottom-6 right-6 z-[9999] flex items-start gap-3 p-4 rounded-xl border-2 ${config.bg} ${config.border} ${config.shadow} backdrop-blur-sm max-w-md`}
        >
          {/* Icon */}
          <div className={`p-2 rounded-lg ${config.iconBg} flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pt-0.5">
            <p className={`text-sm font-medium leading-relaxed ${config.textColor}`}>
              {message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Progress Bar */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 4, ease: 'linear' }}
            className={`absolute bottom-0 left-0 h-1 rounded-b-xl ${
              type === 'success' ? 'bg-green-500' :
              type === 'error' ? 'bg-red-500' :
              type === 'warning' ? 'bg-amber-500' :
              'bg-blue-500'
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
