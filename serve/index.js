const { createWebpackServer } = require('./webpack.server.js');

// TODO - Generalize dev server to support all bundlers
const serve = async () => {
  createWebpackServer();
}

module.exports = {
  serve
}