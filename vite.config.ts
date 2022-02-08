/// <reference types="vitest" />

import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import svgrPlugin from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [reactRefresh(), svgrPlugin()],
  server: {
    open: true,
    host: '0.0.0.0',
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  test: {
    include: ['**/*.test.ts'],
  },
})
