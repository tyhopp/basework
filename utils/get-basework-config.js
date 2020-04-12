const fs = require('fs');
const path = require('path');

const getBaseworkConfigPath = async () => {
  const configPath = path.resolve('basework-config.js');
  if (fs.existsSync(configPath)) {
    return configPath;
  }
  return null;
}

const getBaseworkConfig = async () => {
  let configPath = await getBaseworkConfigPath();
  if (!configPath) {
    return {
      bundler: 'webpack',
      prefetch: true,
      prerender: true
    }
  }
  const baseworkConfig = require(configPath);
  if (typeof baseworkConfig === 'function') {
    return baseworkConfig();
  }
  return baseworkConfig;
}

module.exports = {
  getBaseworkConfig
}