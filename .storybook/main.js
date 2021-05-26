module.exports = {
  stories: ['../src/stories/**/*.stories.mdx', '../src/stories/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/preset-create-react-app'],

  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'none',
  },

  reactOptions: {
    fastRefresh: true,
  },

  webpackFinal: (config) => {
    return {
      ...config,
      plugins: config.plugins.filter((plugin) => plugin.constructor.name !== 'ESLintWebpackPlugin'),
    };
  },
};
