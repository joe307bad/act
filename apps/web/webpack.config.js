const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      tsyringe: require.resolve('tsyringe/dist/esm2015/index.js')
    }
  };
  return config;
});
