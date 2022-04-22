/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgrPlugin()],
  server: {
    // open: true, // opens browser when cypress runs
    host: '0.0.0.0',
  },
  test: {
    include: ['**/*.test.ts'],
  },
})
