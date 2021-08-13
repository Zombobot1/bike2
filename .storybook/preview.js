const { theme } = require('../src/theme')
const { OuterShell } = require('../src/components/Shell/Shell')
const { ThemeProvider, createTheme } = require('@material-ui/core/styles')
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming'

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
// https://github.com/mui-org/material-ui/issues/27238#issuecomment-878844052
export const decorators = [
  (Story) => (
    <EmotionThemeProvider theme={theme}>
      <OuterShell>
        <Story />
      </OuterShell>
    </EmotionThemeProvider>
  ),
]
