const dotenv = require('dotenv');
const { prepare } = require('./prepare');
const { prefetch } = require('./prefetch');
const { transform } = require('./transform');
const { bundle } = require('./bundle');
const { createPages } = require('./create');
const { prerender } = require('./prerender');

const bootstrap = async () => {
  dotenv.config();
  await prepare(); // Create routes and pages objects used by other steps
  await prefetch(); // Make ahead-of-time network requests and save data locally
  await transform(); // Perform transformations on prefetched data (e.g. markdown to html)
  await bundle(); // Bundle site resources using webpack
  await createPages(); // Create html pages with referenced assets
  await prerender(); // Load site pages in a headless browser to prerender html
}

bootstrap();