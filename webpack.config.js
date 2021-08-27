/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

// require('@pmmmwh/react-refresh-webpack-plugin'); doesn't work with cypress
const ReactRefreshWebpackPlugin = require('@next/react-refresh-utils/ReactRefreshWebpackPlugin').default
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { InjectManifest } = require('workbox-webpack-plugin')

let mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
let target = 'web' // https://github.com/webpack/webpack-dev-server/issues/2758
const entry = ['./src/index.tsx']

const plugins = [
  new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'] }),
  new HtmlWebpackPlugin({ template: './src/index.html' }),
  new ForkTsCheckerWebpackPlugin({
    typescript: {
      diagnosticOptions: {
        semantic: true,
        syntactic: true,
      },
      mode: 'write-references',
    },
  }),
  new CopyPlugin({
    patterns: [{ from: 'public', to: '' }], // to dist folder root
  }),
]

const rules = [
  {
    test: /\.css$/i,
    use: ['style-loader', 'css-loader'],
  },
  {
    test: /\.svg$/, // https://github.com/gregberge/svgr/issues/551#issuecomment-863230524
    oneOf: [
      {
        dependency: { not: ['url'] }, // exclude new URL calls
        use: ['@svgr/webpack', 'new-url-loader'],
      },
      {
        type: 'asset', // export a data URI or emit a separate file
      },
    ],
  },
  {
    test: /\.(png|jpe?g|gif|mp3)$/i,
    type: 'asset', // instead file-loader & url-loader
  },
  {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      },
    },
  },
]

if (mode === 'production') {
  target = 'browserslist'
  plugins.push(
    new InjectManifest({
      swSrc: './src/service-worker',
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // See https://github.com/cra-template/pwa/issues/13#issuecomment-722667270
    }),
  )
} else {
  entry.unshift(require.resolve('@next/react-refresh-utils/runtime')) // push doesn't work
  plugins.push(new ReactRefreshWebpackPlugin())
  rules.push({
    test: /\.(tsx|ts|js|mjs|jsx)$/,
    include: [path.join(__dirname, 'src')],
    exclude: [/node_modules/],
    use: [require.resolve('@next/react-refresh-utils/loader')],
  })
}

module.exports = {
  entry,
  mode,
  output: {
    path: path.resolve(__dirname, 'dist'), // output path is required for `clean-webpack-plugin`
    assetModuleFilename: 'static/[name].[hash:8].[ext]',
    publicPath: '/', // https://stackoverflow.com/questions/28846814/what-does-publicpath-in-webpack-do https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/getPublicUrlOrPath.js
  },

  module: { rules },

  plugins: plugins,

  target: target,

  devtool: mode === 'development' ? 'cheap-module-source-map' : false,

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs'],
  },

  devServer: {
    contentBase: './dist',
    hot: true,
    historyApiFallback: true, // for router
  },
}
