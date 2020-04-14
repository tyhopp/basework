const fs = require('fs');
const path = require('path')
const { JSDOM } = require('jsdom');
const { customResourceLoader } = require('./resource-loader');
const { pages } = require(path.resolve('src/routes'));

const prerender = async () => {
  for (const page of pages) {
    JSDOM
      .fromFile(path.resolve('dist', `${page}.html`), {
        url: `file:${path.resolve(`dist/${page}.html?prerender=${page}`)}`,
        runScripts: 'dangerously',
        resources: customResourceLoader
      })
      .then(dom => {
        dom.window.addEventListener('load', () => {
          const html = dom.serialize();
          fs.writeFile(`${path.resolve('dist', `${page}.html`)}`, html, error => {
            if (error) throw error;
            console.log(`Prerendered ${page} page`);
          });
        });
      });
  }
}

module.exports = {
  prerender
}