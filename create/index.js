const fs = require('fs');
const path = require('path');
const { createPage } = require('./create-page');

const getTemplate = template => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(template), (error, html) => {
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

const create = async ({ page, template, head, assetIndex }) => {
  const htmlTemplate = await getTemplate(template ? template : 'src/base.html');
  const groups = require(path.resolve('dist/webpack.stats.js')).stats;
  const assets = groups[assetIndex ? assetIndex : page];
  const html = await createPage(htmlTemplate, assets, head);
  await createFile(page, html);
}

module.exports = {
  create
}