const path = require('path');
const merge = require('webpack-merge');
const config = require('./webpack-config');
const { getCustomConfig } = require(path.resolve(__dirname, '../../utils/get-custom-config'));

const createProdWebpackConfig = async () => {
  
  // Resolve base config
  const defaultBaseConfig = await config();
  const customBaseConfig = await getCustomConfig(path.resolve('webpack-config.js'));
  const baseConfig = merge(defaultBaseConfig, customBaseConfig);

  // Resolve prod config
  const defaultProdConfig = {
    mode: 'production',
    devtool: 'source-map',
  };
  const customProdConfig = await getCustomConfig(path.resolve('webpack-config-prod.js'));
  const prodConfig = merge(defaultProdConfig, customProdConfig);

  // Resolve final config
  return merge(baseConfig, prodConfig);
}

module.exports = createProdWebpackConfig;