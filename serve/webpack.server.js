const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const app = express();
const createConfig = require('../bundle/webpack.config.js');
const { prepare } = require('../prepare');
const { prefetch } = require('../prefetch');
const { transform } = require('../transform');
const { createPages } = require('../create');
const { extractStats } = require('../bundle/extract-stats');

const getFile = file => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(`dist${file}`), (error, buffer) => {
      if (error || !buffer) {
        reject(error);
      }
      resolve(buffer.toString());
    });
  });
}

const getHtml = async (url, response) => {
  dotenv.config();
  await prepare();
  await prefetch();
  await transform();
  const { compilation } = response.locals.webpackStats;
  await extractStats(compilation);
  await createPages();
  return await getFile(url);
}

const createWebpackServer = async () => {
  const config = await createConfig();
  const compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: '/', // Where to serve assets
    writeToDisk: true,
    serverSideRender: true
  }));

  app.use((request, response) => {
    const { routes } = require(path.resolve('src/routes'));
    const { url } = request;

    if (!fs.existsSync(path.resolve(`dist${url}`))) {
      response.send('');
      return;
    }

    if (url.includes('json')) {
      getFile(url)
        .then(file => {
          response.send(file);
        })
        .catch(error => {
          console.error(`[Error] - Dev server encountered an error:\n${error}`);
        })
    }

    if (routes[url]) {
      getHtml(`/${routes[url]}.html`, response).then(html => {
        response.send(html);
      });
    }

  });

  app.listen(8000, function () {
    console.log('Basework dev server started at port 8000\n');
    // TODO - Open browser automatically
  });
}

module.exports = {
  createWebpackServer
}