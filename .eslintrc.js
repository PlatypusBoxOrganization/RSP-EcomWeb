module.exports = {
  extends: [
    // Your existing ESLint config
  ],
  plugins: [
    'react-compiler',
  ],
  rules: {
    'react-compiler/react-compiler': 'error',
  },
  // Enable React Compiler's auto-memoization
  settings: {
    react: {
      version: '18.2.0',
    },
  },
};
