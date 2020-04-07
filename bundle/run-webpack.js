const webpack = require('webpack');
const { extractStats } = require('./extract-stats');

const runWebpack = config => {
  return new Promise((resolve, reject) => {
    webpack(config).run((error, stats) => {
      if (error) {
        reject(error);
      }
      console.log('Bundled assets');
      
      extractStats(stats.compilation);
      console.log('Created stats');
      resolve(stats);
    });
  });
}

module.exports = {
  runWebpack
}