const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const app = express();
const createConfig = require('./webpack.config.js');
const { prepare } = require('./scripts/prepare');
const { prefetch } = require('./scripts/prefetch');
const { transform } = require('./scripts/transform');
const { createPages } = require('./scripts/create');
const { extractStats } = require('./scripts/bundle/extract-stats');

const getFile = file => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(`dist${file}`), (error, buffer) => {
      if (error || !buffer) {
        reject(error)
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

const serve = async () => {
  const config = await createConfig();
  const compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: '/', // Where to serve assets
    writeToDisk: true,
    serverSideRender: true
  }));

  app.use((request, response) => {
    const { routes } = require('./src/routes');
    const { url } = request;

    if (url.includes('json')) {
      getFile(url).then(file => {
        response.send(file);
      });
    }

    if (routes[url]) {
      getHtml(`/${routes[url]}.html`, response).then(html => {
        response.send(html);
      });
    }
  });

  app.listen(8000, function () {
    console.log('Dev server started at port 8000\n');
  });
}

serve();