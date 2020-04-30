const unified = require('unified');
const parse = require('rehype-parse');
const stringify = require('rehype-stringify');
const { addImports } = require('./add-imports');
const { copyFiles } = require('./copy-files');

const createPage = (template, assets, head) => {
  return unified()
    .use(parse)
    .use(addImports, { assets, head })
    .use(copyFiles)
    .use(stringify)
    .processSync(template).contents;
}

module.exports = {
  createPage
}