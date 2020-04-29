const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const app = express();
const createWebpackConfig = require(path.resolve(__dirname, '../bundle/webpack/webpack-config'));
const { prepare } = require(path.resolve(__dirname, '../prepare'));
const { prefetch } = require(path.resolve(__dirname, '../prefetch'));
const { transform } = require(path.resolve(__dirname, '../transform'));
const { bundle } = require(path.resolve(__dirname, '../bundle'));
const { create } = require(path.resolve(__dirname, '../create'));
const { getBaseworkConfig } = require(path.resolve(__dirname, '../utils/get-basework-config'));
const { getBaseworkApis } = require(path.resolve(__dirname, '../utils/get-basework-apis'));

const runAnyUserDefinedSteps = async () => {
  let steps = [];
  const { build } = await getBaseworkConfig();
  if (build) {
    steps = build;
  }

  buildLoop: for (const step of steps) {
    const apis = await getBaseworkApis();
    if (apis[step] && typeof apis[step] === 'function') {
      await apis[step]();
      continue buildLoop;
    }
  }
}

const getFile = file => {
  return new Promise((resolve, reject) => {
    const pathToFile = path.resolve(`dist${file}`);
    if (!fs.existsSync(pathToFile)) {
      console.warn(`Unable to access file at ${pathToFile}`);
      return;
    }
    fs.readFile(pathToFile, (error, buffer) => {
      if (error || !buffer) {
        reject(error);
      }
      resolve(buffer.toString());
    });
  });
}

const ensureJsonExists = async url => {
  if (!fs.existsSync(path.resolve(`dist/${url}`))) {
    const page = /\/(.*)-data\.json/.exec(url)[1];
    await prefetch({
      page,
      source: path.resolve(`./src/pages/${page}/index.js`)
    });
    await transform({ page });
  }
}

const getJson = async (url, response) => {
  await ensureJsonExists(url);
  const file = await getFile(url, response)
  response.send(file);
}

const getHtml = async (page, response) => {
  await prefetch({
    page,
    source: path.resolve(`./src/pages/${page}/index.js`)
  });
  await transform({ page });
  await create({ page });
  return await getFile(`/${page}.html`, response);
}

const startDevServer = async () => {
  if (!fs.existsSync(path.resolve('./src/basework-index.js'))) {
    await prepare();
  }
  if (!fs.existsSync(path.resolve('dist/webpack.stats.js'))) {
    await bundle();
  }
  await runAnyUserDefinedSteps(); // TODO - Make this togglable via CLI arg
  // TODO - Open browser automatically
}

const createWebpackServer = async () => {
  const config = await createWebpackConfig();
  const pages = await require(path.resolve('src/basework-index')).getPages();
  const compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: '/', // Where to serve assets
    writeToDisk: true,
    serverSideRender: true
  }));

  app.use((request, response) => {
    let { url } = request;

    if (url.includes('json')) {
      getJson(url, response);
      return;
    }

    if (url === '/') {
      url = 'index';
    } else {
      url = url.substr(1);
    }
    if (!pages.some(validPage => validPage.includes(url))) {
      url = 'not-found';
    }
    getHtml(url, response).then(html => {
      response.send(html);
      return;
    });
  });

  app.listen(8000, function () {
    dotenv.config();
    startDevServer();
  });
}

module.exports = {
  createWebpackServer
}