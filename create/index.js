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

const create = async ({ page, assets = [] }) => {
  const template = await getTemplate('base.html');

  // Use passed assets if they exist
  let finalAssets = assets;

  // If they don't, get them directly from webpack.stats.js
  if (!finalAssets.length) {
    const groups = require(path.resolve('dist/webpack.stats.js')).stats;
    finalAssets = groups[page];
  }

  const html = await createPage(template, finalAssets);
  await createFile(page, html);
}

module.exports = {
  create
}