/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    clearMocks: true,
    css: { modules: { classNameStrategy: 'non-scoped' } },
    // Node's fetch cannot resolve relative URLs, so tests call an absolute mock origin.
    env: { VITE_API_BASE_URL: 'http://localhost/api', VITE_API_MOCKING: 'disabled' },
    coverage: { include: ['src/**'], exclude: ['src/mocks/**', 'src/test/**', 'src/main.tsx'] },
  },
})
