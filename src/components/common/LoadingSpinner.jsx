import React from 'react';
import { FaSpinner } from 'react-icons/fa';

/**
 * LoadingSpinner component that displays a loading animation
 * @param {Object} props - Component props
 * @param {string} [props.size='medium'] - Size of the spinner (small, medium, large)
 * @param {string} [props.color='text-blue-600'] - Tailwind text color class
 * @param {string} [props.className=''] - Additional CSS classes
 */
const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'text-blue-600',
  className = '' 
}) => {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <FaSpinner 
        className={`animate-spin ${sizeClasses[size] || sizeClasses.medium} ${color}`} 
        aria-hidden="true"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
