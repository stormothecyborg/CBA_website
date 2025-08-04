import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Define props for the Modal component
interface ModalProps {
  isOpen: boolean;             // Controls whether the modal is visible
  onClose: () => void;         // Callback to close the modal (e.g., on overlay or button click)
  title: string;               // Title text displayed at the top of the modal
  children: React.ReactNode;   // Modal body content
  size?: 'sm' | 'md' | 'lg';   // Optional size modifier for modal width
}

// Reusable Modal component with animation, backdrop, and close functionality
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  // Tailwind width utility classes for different modal sizes
  const sizeClasses = {
    sm: 'max-w-md',     // Small modal
    md: 'max-w-lg',     // Medium modal (default)
    lg: 'max-w-2xl',    // Large modal
  };

  return (
    // AnimatePresence allows the modal and overlay to animate out when unmounted
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Center the modal vertically and horizontally */}
          <div className="flex min-h-screen items-center justify-center p-4">
            
            {/* Overlay background (clicking it triggers onClose) */}
            <motion.div
              initial={{ opacity: 0 }}            // Fade in
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}               // Fade out
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}                   // Clicking outside modal closes it
            />
            
            {/* Modal content with entrance and exit animations */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}   // Start smaller and slightly lower
              animate={{ opacity: 1, scale: 1, y: 0 }}       // Animate to full size and position
              exit={{ opacity: 0, scale: 0.95, y: 20 }}      // Reverse on exit
              transition={{ duration: 0.2 }}                 // Smooth transition
              className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl p-6`}
            >
              {/* Modal header section with title and close icon */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <button
                  onClick={onClose} // Close when X is clicked
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" /> {/* Lucide icon for close (X) */}
                </button>
              </div>

              {/* Modal body content injected via children */}
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
