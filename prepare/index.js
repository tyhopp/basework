const { createBaseworkIndex } = require('./create-basework-index');

/**
 * Does all the necessary preparation required for other build steps to run.
 */
const prepare = async () => {
  const pages = await createBaseworkIndex();
  return pages;
}

module.exports = {
  prepare
}