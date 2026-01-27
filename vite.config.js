import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['backend/**', 'node_modules/**']
  },
  server: {
    host: true,
    port: 5173
  }
})
