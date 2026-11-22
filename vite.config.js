import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Прокси для получения токена GigaChat
      '/api/oauth': {
        target: 'https://ngw.devices.sberbank.ru:9443',
        changeOrigin: true,
        secure: false, // Отключаем проверку SSL для Сбера
        rewrite: (path) => path.replace(/^\/api\/oauth/, '/api/v2/oauth')
      },
      // Прокси для самого чата GigaChat
      '/api/gigachat': {
        target: 'https://gigachat.devices.sberbank.ru',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/gigachat/, '/api/v1/chat/completions')
      }
    }
  }
})
