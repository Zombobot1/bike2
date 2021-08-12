const custom = require('../webpack.config.js')
const ReactRefreshWebpackPlugin = require('@next/react-refresh-utils/ReactRefreshWebpackPlugin').default
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  core: {
    builder: 'webpack5',
  },
  webpackFinal: (config) => {
    const r = {
      ...config,
      devtool: 'cheap-module-source-map',
      module: {
        ...config.module,
        rules: custom.module.rules,
      },
      plugins: [
        config.plugins[0], // VirtualModulesPlugin
        config.plugins[1], // HtmlWebpackPlugin
        config.plugins[2], // DefinePlugin
        config.plugins[4], // HotModuleReplacementPlugin
        new ForkTsCheckerWebpackPlugin({
          typescript: {
            diagnosticOptions: {
              semantic: true,
              syntactic: true,
            },
            mode: 'write-references',
          },
        }),
        new ReactRefreshWebpackPlugin(),
        new CopyPlugin({
          patterns: [{ from: 'public', to: '' }], // to dist folder root
        }),
      ],
    }
    r.entry.unshift(require.resolve('@next/react-refresh-utils/runtime'))
    return r
  },
}
