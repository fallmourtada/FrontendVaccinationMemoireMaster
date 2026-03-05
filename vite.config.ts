import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      // Proxy pour contourner CORS en développement
      // Service Users sur le port 8083
      '/api/v1/users': {
        target: 'http://localhost:8083',
        changeOrigin: true,
        secure: false,
      },
      // Service Vaccins sur le port 8087
      '/api/v1/vaccines': {
        target: 'http://localhost:8087',
        changeOrigin: true,
        secure: false,
      },
      // Service Appointments sur le port 8085
      '/api/v1/appointments': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        secure: false,
      },
      // Service Vaccinations sur le port 8088
      '/api/v1/vaccinations': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false,
      },
      // Auth service - ajustez le port si nécessaire
      '/api/auth': {
        target: 'http://localhost:9999',
        changeOrigin: true,
        secure: false,
      },
      // Service de prédiction FastAPI sur le port 8000
      '/prediction-api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/prediction-api/, ''),
      },
      // Autres services via gateway
      '/api': {
        target: 'http://localhost:9999',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
