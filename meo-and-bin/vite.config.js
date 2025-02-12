import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/github-api': {
        target: 'https://github-contributions.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/github-api/, '')
      }
    }
  },
  base: process.env.NODE_ENV === "production" ? "/Valentine-Vue-Tailwind/" : "/",
})