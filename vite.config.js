import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const REACT_APP_API_URL = import.meta.env.REACT_APP_API_URL

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4500,
    proxy: {
      '/api': {
        target: REACT_APP_API_URL || 'http://localhost:7000', // Replace with your backend server URL
        changeOrigin: true,
        secure: false,
      },  // Proxy API requests to Node.js backend
    },
  }
})
