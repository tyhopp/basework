const visit = require('unist-util-visit');

// TODO - Figure out how to add child import tags

// Visit the unist tree and add meta tags
const addImports = ({ assets }) => tree => {
  if (!assets || !assets.length) {
    return;
  }
  
  visit(
    tree,
    node => {
      const createScriptTag = asset => ({
        type: 'element',
        tagName: 'script',
        properties: {
          async: true,
          src: `${asset}`,
          type: 'text/javascript'
        },
        children: {},
        position: {}
      });

      const createLinkPreloadTag = asset => ({
        type: 'element',
        tagName: 'link',
        properties: {
          rel: 'preload',
          href: `${asset}`,
          as: 'style'
        },
        children: {},
        position: {}
      });

      const createLinkStyleTag = asset => ({
        type: 'element',
        tagName: 'link',
        properties: {
          rel: 'stylesheet',
          href: `${asset}`,
          type: 'text/css'
        },
        children: {},
        position: {}
      });

      const appendTags = ({ node, assets }) => {
        for (const asset of assets) {
          switch (/\.([^.]*)$/.exec(asset)[1]) {
            case 'js':
              if (node.tagName === 'body') {
                node.children.push(createScriptTag(asset));
              }
              break;
            case 'css':
              if (node.tagName === 'head') {
                node.children.push(createLinkPreloadTag(asset));
                node.children.push(createLinkStyleTag(asset));
              }
              break;
          }
        }
      }

      switch (node.tagName) {
        case 'head':
          appendTags({ node, assets });
          break;
        case 'body':
          appendTags({ node, assets });
          break;
      }
    }
  );
}

module.exports = {
  addImports
}