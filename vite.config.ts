import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import svgrPlugin from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [reactRefresh(), svgrPlugin()],
  server: {
    open: true,
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})
