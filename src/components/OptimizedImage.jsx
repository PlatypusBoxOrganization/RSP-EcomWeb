import React, { useState, useMemo, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

// Transparent 1x1 pixel as base64
const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

const OptimizedImage = ({
  src,
  alt = '',
  className = '',
  width,
  height,
  placeholderSrc,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Generate placeholder or use provided one
  const placeholder = useMemo(() => {
    if (placeholderSrc) return placeholderSrc;
    
    // Only create canvas on client-side
    if (typeof window !== 'undefined') {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL();
      } catch (e) {
        return TRANSPARENT_PIXEL;
      }
    }
    return TRANSPARENT_PIXEL;
  }, [placeholderSrc]);

  const handleLoad = () => {
    if (isMounted) {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    if (isMounted) {
      setError(true);
      setIsLoading(false);
    }
  };

  // If image failed to load, show a placeholder
  if (error) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt ? `${alt} (not available)` : 'Image not available'}
      >
        <span className="text-gray-400 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <div 
      className={`relative ${className}`} 
      style={{ width, height }}
    >
      {/* Placeholder/Loading state */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          aria-hidden={!isLoading}
        >
          <div 
            className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"
            aria-label="Loading..."
          />
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
