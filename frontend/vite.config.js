import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  return {
    plugins: [react()],
    build: {
      // CRITICAL: Disable source maps in production to prevent source code exposure
      sourcemap: false,
      
      // Use esbuild for minification (faster, no extra dependencies needed)
      minify: 'esbuild',
      
      // ESBuild minification options
      esbuild: isProduction ? {
        drop: ['console', 'debugger'],  // Remove console.log and debugger
        legalComments: 'none',          // Remove comments
      } : undefined,
      
      // Optimize chunk size
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
      
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,
    },
    
    // Security headers
    server: {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      },
    },
  }
})
