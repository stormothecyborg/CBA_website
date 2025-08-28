import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Define props for the Modal component
interface ModalProps {
  isOpen: boolean;             // Controls visibility of the modal
  onClose: () => void;         // Function to close the modal
  title: string;               // Modal title
  children: React.ReactNode;   // Content inside the modal
  size?: 'sm' | 'md' | 'lg';   // Optional size variant
}

// Functional Modal component
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  // Width classes based on selected size
  const sizeClasses = {
    sm: 'max-w-md',     // Small modal
    md: 'max-w-lg',     // Medium modal (default)
    lg: 'max-w-2xl',    // Large modal
  };

  return (
    <AnimatePresence> {/* Enables exit animations */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Centered modal container */}
          <div className="flex min-h-screen items-center justify-center p-4">
            
            {/* Background overlay with fade in/out */}
            <motion.div
              initial={{ opacity: 0 }}            // Fade in
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}               // Fade out
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose} // Close modal when overlay is clicked
            />
            
            {/* Modal content container with scale and slide animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}   // Start smaller and slightly lower
              animate={{ opacity: 1, scale: 1, y: 0 }}       // Animate to full size and position
              exit={{ opacity: 0, scale: 0.95, y: 20 }}      // Reverse on exit
              transition={{ duration: 0.2 }}                 // Smooth transition
              className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl p-6`}
            >
              {/* Modal header with title and close button */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <button
                  onClick={onClose} // Close when X is clicked
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" /> {/* Close icon */}
                </button>
              </div>

              {/* Modal body content */}
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
