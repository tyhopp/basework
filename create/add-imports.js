const visit = require('unist-util-visit');

const createScriptTag = asset => ({
  type: 'element',
  tagName: 'script',
  properties: {
    async: true,
    src: `${asset}`,
    type: 'text/javascript'
  },
  children: [],
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
  children: [],
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
  children: [],
  position: {}
});

const createMetaTag = properties => ({
  type: 'element',
  tagName: 'meta',
  properties,
  children: [],
  position: {}
});

const createTitleTag = title => ({
  type: 'element',
  tagName: 'title',
  properties: {},
  children: [
    {
      "type": "text",
      "value": title,
      "position": {}
    }
  ],
  position: {}
});

const appendTags = ({ node, assets }) => {
  if (!assets || !assets.length) {
    return;
  }
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

const createMetaTags = ({ node, head }) => {
  if (!head) {
    return;
  }
  createLoop: for (const item in head) {
    const valid = [
      'title',
      'description',
      'keywords',
      'url'
    ].some(validItem => validItem === item);
    if (!valid) {
      continue createLoop;
    }
    triage: switch(item) {
      case 'title':
        node.children.push(createTitleTag(head[item]));
        break triage;
      case 'url':
        node.children.push(
            createMetaTag({
            property: 'og:url',
            content: head[item]
          })
        );
        continue createLoop;
    }
    node.children.push(
      createMetaTag({
        name: item,
        content: head[item]
      }),
      createMetaTag({
        property: `og:${item}`,
        content: head[item]
      })
    );
  }
}

// Visit the unist tree and add meta tags
const addImports = ({ assets, head }) => tree => {
  if (!assets && !assets.length && !head) {
    return;
  }
  visit(
    tree,
    node => {
      switch (node.tagName) {
        case 'head':
          appendTags({ node, assets });
          createMetaTags({ node, head });
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