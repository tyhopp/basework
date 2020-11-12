const path = require('path');
const merge = require('webpack-merge');
const config = require('./webpack-config');
const { getCustomConfig } = require(path.resolve(__dirname, '../../utils/get-custom-config'));

const createDevWebpackConfig = async () => {

  // Resolve base config
  const defaultBaseConfig = await config();
  const customBaseConfig = await getCustomConfig(path.resolve('webpack-config.js'));
  const baseConfig = merge(defaultBaseConfig, customBaseConfig);

  // Resolve dev config
  const defaultDevConfig = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
    }
  };
  const customDevConfig = await getCustomConfig(path.resolve('webpack-config-dev.js'));
  const devConfig = merge(defaultDevConfig, customDevConfig);
  
  // Resolve final config
  return merge(baseConfig, devConfig);
}

module.exports = createDevWebpackConfig;