import React from 'react';

// Define props for the Input component, extending default input attributes
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Optional label text
  error?: string; // Optional error message
}

// Functional Input component
export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props // Spread any other input props (e.g., type, placeholder, value)
}) => {
  return (
    <div className="space-y-1"> {/* Container with vertical spacing */}
      {label && (
        // Render label if provided
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        // Input field with base styles, focus styles, and conditional error styles
        className={`block w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        // Display error message if provided
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
