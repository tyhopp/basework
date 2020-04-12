const webpack = require('webpack');
const { extractStats } = require('./extract-stats');

const runWebpack = webpackConfig => {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((error, stats) => {
      if (error) {
        reject(error);
      }

      if (stats.hasErrors()) {
        const errors = stats.compilation.errors;
        console.error(`[Error] - Webpack encountered ${errors.length} error${errors.length > 1 ? 's' : ''}:\n`);
        errors.forEach(error => {
          console.error(error, '\n');
        });
      }

      console.log('Bundled assets');

      extractStats(stats.compilation);
      console.log('Created stats');

      resolve(stats);
    });
  });
}

module.exports = runWebpack;