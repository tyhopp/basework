const fs = require('fs');
const path = require('path')
const { JSDOM } = require('jsdom');
const { customResourceLoader } = require('./resource-loader');

const prerender = async ({ page }) => {
  JSDOM
    .fromFile(path.resolve('dist', `${page}.html`), {
      url: `file:${path.resolve(`dist/${page}.html?prerender=${page}`)}`,
      runScripts: 'dangerously',
      resources: customResourceLoader
    })
    .then(dom => {
      // Shims for jsdom env
      dom.window.matchMedia = () => ({
        matches: 'light',
        addListener: () => 'light',
        removeListener: () => {}
      });
      dom.window.scrollTo = () => {}

      // Wait for page to finishing loading and write to file
      dom.window.addEventListener('basework-complete', () => {
        const html = dom.serialize();
        fs.writeFile(`${path.resolve('dist', `${page}.html`)}`, html, error => {
          if (error) throw error;
          console.log(`Prerendered ${page} page`);
        });
      });
    });
}

module.exports = {
  prerender
}