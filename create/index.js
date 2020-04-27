const fs = require('fs');
const path = require('path');
const { createPage } = require('./create-page');

const getTemplate = template => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(`src/${template}`), (error, html) => {
      if (error) {
        reject(error)
      }
      resolve(html.toString());
    });
  });
}

const createFile = (page, html) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${path.resolve(`dist/${page}.html`)}`, html, error => {
      if (error) {
        reject(error)
      }
      console.log(`Created ${page} page`);
      resolve();
    });
  });
}

const create = async ({ page, assets = {} }) => {
  const template = await getTemplate('base.html');
  const groups = require(path.resolve('dist/webpack.stats.js')).stats;
  const assetsFromStats = groups[page];
  const html = await createPage(template, { ...assets, ...assetsFromStats });
  await createFile(page, html);
}

module.exports = {
  create
}