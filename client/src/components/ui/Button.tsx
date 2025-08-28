import React from 'react';
import { motion } from 'framer-motion';

// Define the props for the Button component, extending motion.button attributes
interface ButtonProps extends React.ComponentPropsWithoutRef<typeof motion.button> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; // Button style variants
  size?: 'sm' | 'md' | 'lg'; // Button size options
  children: React.ReactNode; // Button content
}

// Functional Button component using framer-motion for animations
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', // Default variant
  size = 'md',         // Default size
  children,
  className = '',      // Allow extra classNames to be passed in
  disabled,            // Built-in disabled support
  ...props             // Spread remaining props to the <button> element
}) => {
  // Base classes shared across all buttons
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Styling based on button variant
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
  };

  // Styling based on button size
  const sizes = {
    sm: 'px-3 py-2 text-sm',        // Small button
    md: 'px-4 py-2.5 text-sm',      // Medium button (default)
    lg: 'px-6 py-3 text-base',      // Large button
  };

  // Styling for disabled state
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <motion.button
      // Add animation only if button is not disabled
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      // Combine all class names dynamically
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props} // Spread remaining props (like onClick, type, etc.)
    >
      {children} {/* Render button content */}
    </motion.button>
  );
};
