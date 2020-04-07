const unified = require('unified');
const parse = require('rehype-parse');
const stringify = require('rehype-stringify');
const { addImports } = require('./add-imports');

const createPage = (template, assets) => {
  return unified()
    .use(parse)
    .use(addImports, { assets })
    .use(stringify)
    .processSync(template).contents;
}

module.exports = {
  createPage
}