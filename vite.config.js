const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const tailwindcss = require('@tailwindcss/vite').default;
const { ViteImageOptimizer } = require('vite-plugin-image-optimizer');
const { compression } = require('vite-plugin-compression2');
const { resolve } = require('path');

// https://vite.dev/config/
module.exports = defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  
  return {
    base: isProduction ? '/' : '/',
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
        png: { quality: 80 },
        jpeg: { quality: 80 },
        jpg: { quality: 80 },
        webp: { 
          quality: 80,
          lossless: false
        },
        avif: {
          quality: 70,
          lossless: false
        },
        cache: true,
        includePublic: true,
      }),
      
      // Compression for production
      isProduction && compression({
        algorithm: 'brotliCompress',
        exclude: [/\.(js|mjs|json|css|html|webp|avif)$/i],
        threshold: 1024,
      }),
      isProduction && compression({
        algorithm: 'gzip',
        exclude: [/\.(br|gz)$/i],
        threshold: 1024,
      }),
    ].filter(Boolean),

    // Build configuration
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction,
      minify: isProduction ? 'terser' : false,
      target: 'esnext',
      cssMinify: isProduction,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            reactIcons: ['react-icons', '@heroicons/react'],
            reactWindow: ['react-window', 'react-virtualized-auto-sizer'],
            vendor: ['lodash', 'lodash.debounce'],
          },
          entryFileNames: 'assets/js/[name]-[hash].js',
          chunkFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            
            if (ext === 'css') {
              return 'assets/css/[name]-[hash][extname]';
            } else if (['png', 'jpe?g', 'webp', 'avif', 'gif', 'svg'].includes(ext)) {
              return 'assets/images/[name]-[hash][extname]';
            } else if (['woff', 'woff2', 'eot', 'ttf', 'otf'].includes(ext)) {
              return 'assets/fonts/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
      copyPublicDir: true,
      emptyOutDir: true,
      reportCompressedSize: false,
    },

    // Optimize dependencies
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext',
      },
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'react-window',
        'react-virtualized-auto-sizer',
        'lodash',
        'lodash.debounce'
      ],
    },

    // Development server configuration
    server: {
      port: 3000,
      open: true,
      strictPort: true,
      hmr: {
        overlay: true,
      },
    },

    // Preview server configuration
    preview: {
      port: 3001,
      open: true,
      strictPort: true,
    },

    // Resolve aliases
    resolve: {
      alias: [
        { find: '@', replacement: resolve(__dirname, 'src') },
        { find: '@components', replacement: resolve(__dirname, 'src/components') },
        { find: '@pages', replacement: resolve(__dirname, 'src/pages') },
        { find: '@assets', replacement: resolve(__dirname, 'src/assets') },
      ],
    },
  };
});
