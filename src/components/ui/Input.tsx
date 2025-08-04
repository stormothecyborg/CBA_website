import React from 'react';

// Define props for the Input component
// Extends default HTML input props (e.g., onChange, type, value, etc.)
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Optional label displayed above the input
  error?: string; // Optional error message displayed below the input
}

// Reusable Input component with label and error support
export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props // Spread any remaining native input props
}) => {
  return (
    // Wrapper with vertical spacing between elements (label, input, error)
    <div className="space-y-1">
      
      {/* Conditionally render the label if provided */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Styled input field with error-based conditional styling */}
      <input
        className={`
          block w-full px-3 py-2.5 border border-gray-300 rounded-xl 
          shadow-sm placeholder-gray-400 transition-all duration-200 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props} // Inject props like value, onChange, name, etc.
      />

      {/* Conditionally render the error message below the input */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
