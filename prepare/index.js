const { createRoutes } = require('./create-routes');

/**
 * Does all the necessary preparation required to bundle the site.
 */
const prepare = async () => {
  const routes = await createRoutes();  
  return routes;
}

module.exports = {
  prepare
}