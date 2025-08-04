import React from 'react';
import { motion } from 'framer-motion';

// Define the props for the Button component
// Extends default <button> props like onClick, type, etc.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; // Predefined visual styles
  size?: 'sm' | 'md' | 'lg'; // Size options for button padding and font
  children: React.ReactNode; // Content (text, icons) to be rendered inside the button
}

// Reusable Button component with animation and theming support
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', // Default style if none is provided
  size = 'md',         // Default size if none is provided
  children,
  className = '',      // Allow extra classNames to be passed in
  disabled,            // Built-in disabled support
  ...props             // Spread remaining props to the <button> element
}) => {
  // Core layout and interaction styles used by all buttons
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Theme-specific styles based on the 'variant' prop
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
  };

  // Size-specific padding and font size
  const sizes = {
    sm: 'px-3 py-2 text-sm',        // Small button
    md: 'px-4 py-2.5 text-sm',      // Medium button (default)
    lg: 'px-6 py-3 text-base',      // Large button
  };

  // Styles applied when the button is disabled
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <motion.button
      // Add scaling animation when hovered or tapped (if not disabled)
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      
      // Dynamically build the final className string
      // Combines base, variant, size, disabled styles and any custom classes
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${disabledClasses} 
        ${className}
      `}
      disabled={disabled} // Disable button if prop is true
      {...props}          // Pass remaining props like onClick, type, etc.
    >
      {children} {/* Display the button content */}
    </motion.button>
  );
};
