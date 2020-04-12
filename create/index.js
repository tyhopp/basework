const fs = require('fs');
const path = require('path');
const { createPage } = require('./create-page');
const { pages } = require(path.resolve('src/routes'));

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

// Create pages
const create = async () => {
  for (const page of pages) {
    const groups = require(path.resolve('dist/webpack.stats.js')).stats;
    if (!groups[page]) {
      console.error(`No webpack stats found for ${page}`);
    }
    const assets = groups[page];
    const template = await getTemplate('base.html');
    const html = await createPage(template, assets);
    await createFile(page, html);
  }
}

module.exports = {
  create
}