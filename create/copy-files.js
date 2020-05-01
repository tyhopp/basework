const fs = require('fs');
const path = require('path');
const visit = require('unist-util-visit');

// Visit the unist tree, find any files that need to be copied to dist,
// and copy those files if they don't exist
const copyFiles = () => tree => {
  visit(
    tree,
    node => {
      if (node.properties && (typeof node.properties['copy'] !== 'undefined') && (node.properties['href'] || node.properties['content'])) {
        const pathToFile = node.properties['href'] || node.properties['content'];
        if (!fs.existsSync(path.resolve(`./${pathToFile}`))) {
          return;
        }
        const { name, ext } = path.parse(pathToFile);
        const destination = path.resolve(`./dist/${name}${ext}`);
        fs.copyFileSync(pathToFile, destination);
        if (node.properties['href']) {
          node.properties['href'] = `/${name}${ext}`;
        }
        if (node.properties['content']) {
          node.properties['content'] = `/${name}${ext}`;
        }
        delete node.properties['copy'];
        return;
      }
    }
  );
}

module.exports = {
  copyFiles
}