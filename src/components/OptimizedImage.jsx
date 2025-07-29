import React, { useState, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  placeholderSrc,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState('');
  const [error, setError] = useState(false);

  // Generate placeholder or use provided one
  const placeholder = useMemo(() => {
    if (placeholderSrc) return placeholderSrc;
    // Create a small, blurred version of the image as a data URL
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL();
  }, [placeholderSrc]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  // If image failed to load, show a placeholder
  if (error) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Placeholder/Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Lazy loaded image */}
      <LazyLoadImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        effect="opacity"
        placeholderSrc={placeholder}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default React.memo(OptimizedImage);
