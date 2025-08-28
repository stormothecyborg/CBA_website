import React from 'react';
import { motion } from 'framer-motion';

// Define props for the Card component
interface CardProps {
  children: React.ReactNode; // Content inside the card
  className?: string;        // Optional additional class names
  hover?: boolean;           // Enable or disable hover effect
}

// Functional Card component using framer-motion for animation
export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false 
}) => {
  return (
    <motion.div
      // Apply hover animation if 'hover' prop is true
      whileHover={hover ? { y: -2, scale: 1.02 } : {}}
      transition={{ duration: 0.2 }} // Smooth animation transition
      // Combine base card styling with any custom class names
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${className}`}
    >
      {children} {/* Render card content */}
    </motion.div>
  );
};
