const createConfig = require('./webpack.config.js');
const { runWebpack } = require('./run-webpack');

/**
 * Runs webpack to bundle all assets.
 */
const bundle = async () => {
  const config = await createConfig();

  if (!config) {
    console.error('No webpack config found');
    return;
  }

  await runWebpack(config);
}

module.exports = {
  bundle
}