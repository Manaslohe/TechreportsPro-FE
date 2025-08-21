import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/pdf.worker.min.js': {
        target: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/',
        changeOrigin: true,
        secure: false,
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
  optimizeDeps: {
    include: ['react-pdf']
  }
})
