const unified = require('unified');
const parse = require('remark-parse');
const transform = require('remark-rehype')
const stringify = require('rehype-stringify');

function markdownToHtml(rawMarkdown) {
  return unified()
    .use(parse)
    .use(transform)
    .use(stringify)
    .processSync(rawMarkdown).contents;
}

module.exports = {
  markdownToHtml
}