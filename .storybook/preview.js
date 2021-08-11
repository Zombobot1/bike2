export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

// https://github.com/storybookjs/storybook/issues/11378#issuecomment-748839692
if (typeof global.process === 'undefined') {
  const { startWorker } = require('../src/api/fapi')
  startWorker()
}
