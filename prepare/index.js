const { createPageIndex } = require('./create-page-index');

/**
 * Does all the necessary preparation required for other build steps to run
 */
const prepare = async () => {
  const pages = await createPageIndex();
  return pages;
}

module.exports = {
  prepare
}