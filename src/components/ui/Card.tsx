import React from 'react';
import { motion } from 'framer-motion';

// Define props for the Card component
interface CardProps {
  children: React.ReactNode; // Content to be displayed inside the card
  className?: string;        // Optional additional class names for custom styling
  hover?: boolean;           // If true, enables a hover animation effect
}

// Reusable Card component with optional hover animation using framer-motion
export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false 
}) => {
  return (
    <motion.div
      // Animate the card slightly upward and scale it up on hover, if enabled
      whileHover={hover ? { y: -2, scale: 1.02 } : {}}
      // Set animation duration for hover transition
      transition={{ duration: 0.2 }}
      
      // Base styling: white background, rounded corners, shadow, light border
      // Custom className prop allows further extension of styles
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${className}`}
    >
      {/* Render the content passed inside the Card component */}
      {children}
    </motion.div>
  );
};
