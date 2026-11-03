import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('/node_modules/')) return undefined

          if (/\/node_modules\/(react|react-dom|react-router|react-router-dom)\//.test(id)) return 'vendor-react'
          if (id.includes('/node_modules/plotly.js/lib/core')) return 'vendor-plotly-core'
          if (/\/node_modules\/plotly.js\/lib\/(scatter|pie|heatmap)/.test(id)) return 'vendor-plotly-traces'
          if (id.includes('/node_modules/react-plotly.js/')) return 'vendor-react-plotly'
          if (id.includes('/node_modules/lucide-react/')) return 'vendor-ui'
          if (/\/node_modules\/(jspdf|jspdf-autotable)\//.test(id)) return 'vendor-pdf'
          return undefined
        },
      },
    },
    chunkSizeWarningLimit: 1100,
  },
})
