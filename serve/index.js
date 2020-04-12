const path = require('path');
const { createWebpackServer } = require(path.resolve(__dirname, './webpack-server'));

// TODO - Generalize dev server to support all bundlers
const serve = async () => {
  createWebpackServer();
}

module.exports = {
  serve
}