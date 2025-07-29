// This file is used to configure the React Compiler
// It will be automatically picked up by the compiler

globalThis.__react_compiler_runtime = {
  // Enable the compiler in all components
  enableInAllComponents: true,
  
  // Keep the existing behavior of useMemo, useCallback, and memo
  // while still allowing the compiler to optimize them
  preserveManualOptimizations: true,
  
  // Log compilation stats in development
  logMetrics: process.env.NODE_ENV === 'development',
  
  // Enable strict mode for better error detection
  strictMode: true,
};
