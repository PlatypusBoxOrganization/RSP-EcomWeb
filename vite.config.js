import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { compression } from 'vite-plugin-compression2';

// https://vite.dev/config/
// Helper function to handle asset paths
const assetPath = (path) => {
  if (process.env.NODE_ENV === 'production') {
    return `./${path}`;
  }
  return `/${path}`;
};

export default defineConfig(({ command, mode }) => ({
  base: './', // Using relative path for Netlify
  define: {
    'import.meta.env.ASSET_PATH': JSON.stringify(assetPath('')),
  },
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler'],
        ],
      },
    }),
    tailwindcss(),

    // Optimize images
    ViteImageOptimizer({
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        lossless: true,
      },
    }),
    // Gzip and Brotli compression
    compression({
      algorithm: 'brotliCompress',
      exclude: [/.(js|mjs|json|css|html)$/i],
    }),
    compression({
      algorithm: 'gzip',
      exclude: [/.(js|mjs|json|css|html)$/i],
    }),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2020',
    sourcemap: mode !== 'production',
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks
          react: ['react', 'react-dom', 'react-router-dom'],
          reactIcons: ['react-icons', '@heroicons/react'],
          reactWindow: ['react-window', 'react-virtualized-auto-sizer'],
          // Other dependencies
          vendor: ['lodash', 'lodash.debounce'],
        },
        // Add content hashes to filenames for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Don't copy public dir to dist - we'll handle it manually
    copyPublicDir: false,
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
    // Pre-bundle dependencies for faster dev server starts
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  // Enable server-side rendering for faster initial loads
  ssr: {
    noExternal: true,
  },
  // Configure development server
  server: {
    port: 3000,
    open: true,
    // Enable HMR (Hot Module Replacement)
    hmr: {
      overlay: true,
    },
  },
  // Configure preview server
  preview: {
    port: 3001,
    open: true,
  },
}))
