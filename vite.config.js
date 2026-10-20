import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/thesis-update-slides/',
  plugins: [react()],
})
