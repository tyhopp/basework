const fs = require('fs');

/**
 * Gets a custom config file if it exists.
 * @param {string} configPath absolute path to the config file
 * @returns {Object}
 */
const getCustomConfig = async configPath => {
  if (!fs.existsSync(configPath)) {
    return {};
  }

  const customConfig = require(configPath);
  if (typeof customConfig === 'function') {
    return customConfig();
  }
  return customConfig;
}

module.exports = {
  getCustomConfig
}