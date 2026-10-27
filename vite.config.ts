import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// base './' deixa o site funcionar em qualquer subpasta (GitHub Pages, Vercel, etc.)
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
  },
})
