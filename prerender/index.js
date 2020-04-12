const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { pages } = require(path.resolve('src/routes'));
const { getBaseworkConfig } = require(path.resolve(__dirname, '../utils/get-basework-config'));

/**
 * Runs Puppeteer to prerender all pages so that:
 *  - The site is usable with JavaScript disabled
 *  - Loading times are as fast as possible
 */
const prerender = async () => {
  const { prerender } = await getBaseworkConfig();
  if (!prerender) {
    return;
  }
  for (const page of pages) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-web-security']
    });
    const browserPage = await browser.newPage();

    // Enable request interception
    await browserPage.setRequestInterception(true);

    // Set correct url paths for local files
    browserPage.on('request', request => {
      if (!request.url().startsWith('file:///')) { // Local file scheme
        request.continue();
        return;
      }

      switch (request.resourceType()) {
        case 'image':
        case 'media':
        case 'font':
        case 'script':
        case 'stylesheet':
          const filename = /\/\/\/(.*)/.exec(request.url())[1];
          request.continue({
            url: `file:${path.resolve('dist', filename)}`
          });
          break;
        default:
          request.continue();
          break;
      }
    });

    // For debugging requests
    // page.on('requestfailed', request => {
    //   console.log(request.url() + ' ' + request.failure().errorText);
    // });

    // Output console logs
    browserPage.on('console', async msg => {
      const args = await msg.args();
      args.forEach(async arg => {
        const value = await arg.jsonValue();
        // Value is serializable
        if (JSON.stringify(value) !== JSON.stringify({})) {
          console.log(`PAGE LOG: ${value}`);
        }
        // Ualue is unserializable (or an empty oject)
        else {
          console.log(`PAGE LOG: ${arg._remoteObject.description}`);
        }
      });
    });
    
    await browserPage.goto(`file:${path.resolve('dist', `${page}.html?prerender=${page}`)}`, { waitUntil: 'networkidle0' });
    const html = await browserPage.content();
    await browser.close();

    fs.writeFile(`${path.resolve('dist', `${page}.html`)}`, html, error => {
      if (error) throw error;
      console.log(`Prerendered ${page} page`);
    });
  }

  return;
}

module.exports = {
  prerender
}