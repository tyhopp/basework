const path = require('path');
const { ResourceLoader } = require('jsdom');

/**
 * Custom resource loader that adjusts paths to local
 * resources in the file system.
 */
class CustomResourceLoader extends ResourceLoader {
  fetch(url, options) {
    let resourcePath = url;
    if (url.startsWith('file:///')) {
      try {
        const filename = /\/\/\/(.*)/.exec(url)[1];
        resourcePath = `file:///${path.resolve('dist', filename)}`;
      } catch (error) {
        console.error(`[Error] - Failed to adjust path to local resource: ${error}`);
      }
    }
    return super.fetch(resourcePath, options);
  }
}

module.exports = {
  customResourceLoader: new CustomResourceLoader()
}