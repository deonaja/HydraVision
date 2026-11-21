import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

const apiTarget = process.env.VITE_PROXY_TARGET || 'http://127.0.0.1:8000'
const usePolling = process.env.VITE_USE_POLLING === 'true'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    watch: usePolling ? { usePolling: true } : undefined,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/storage': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
})
