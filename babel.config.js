// Cannot load "react-refresh/babel" in production

module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }], // React 17+,
  ],
}
