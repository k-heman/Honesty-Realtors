import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    proxy: {
      '/api/webhook': {
        target: 'https://workflow.ccbp.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/webhook/, '/webhook-test/a7dd7e3a-8f7e-4af9-8913-10518c362f2f')
      }
    }
  }
})