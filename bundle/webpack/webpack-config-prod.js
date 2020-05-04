const merge = require('webpack-merge');
const config = require('./webpack-config');

const createProdWebpackConfig = async () => {
  const baseConfig = await config();
  return merge(baseConfig, {
    mode: 'production',
    devtool: 'source-map',
  });
}

module.exports = createProdWebpackConfig;