const merge = require('webpack-merge');
const config = require('./webpack-config');

const createDevWebpackConfig = async () => {
  const baseConfig = await config();
  return merge(baseConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
    },
  });
}

module.exports = createDevWebpackConfig;