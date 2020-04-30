const rehype = require('rehype');
const rehypePrism = require('@mapbox/rehype-prism');

function highlightSyntax(html) {
  return rehype()
    .use(rehypePrism)
    .processSync(html).contents;
}

module.exports = {
  highlightSyntax
}