/**
 * Helper function to get the correct image path for both development and production
 * @param {string} path - The path to the image relative to the public directory
 * @returns {string} The correct path for the current environment
 */
export const getImagePath = (path) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // In production, use relative path
  if (import.meta.env.PROD) {
    return `./${cleanPath}`;
  }
  
  // In development, use absolute path
  return `/${cleanPath}`;
};

/**
 * Helper function to get the correct path for static assets
 * @param {string} path - The path to the asset relative to the public directory
 * @returns {string} The correct path for the current environment
 */
export const getAssetPath = (path) => {
  return getImagePath(path);
};
