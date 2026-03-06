import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AlertBanner = ({ message, onClose, type = 'info' }) => {
  const bgColors = {
    info: 'bg-[var(--gold)]',
    warning: 'bg-orange-500',
    error: 'bg-red-500',
    success: 'bg-green-500',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`${bgColors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-3`}
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-cairo text-sm md:text-base">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertBanner;