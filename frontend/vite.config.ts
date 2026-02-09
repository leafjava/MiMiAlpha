import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 明确监听所有网络接口
    port: 5173,
    strictPort: true,
    proxy: {
      // 代理所有 /api 和 /v1 请求到 PythonAnywhere
      '/api': {
        target: 'https://a37615959.pythonanywhere.com',
        changeOrigin: true,
        secure: false,
      },
      '/v1': {
        target: 'https://a37615959.pythonanywhere.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
