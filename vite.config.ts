/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgrPlugin()],
  server: {
    open: true,
    host: '0.0.0.0',
  },
  // esbuild: {
  //   jsxInject: `import React from 'react'`,
  // },
  test: {
    include: ['**/*.test.ts'],
  },
})
