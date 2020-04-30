const fs = require('fs');
const path = require('path');
const visit = require('unist-util-visit');

// Visit the unist tree, find any files that need to be copied to dist,
// and copy those files if they don't exist
const copyFiles = () => tree => {
  visit(
    tree,
    node => {
      if (node.properties && (typeof node.properties['copy'] !== 'undefined') && node.properties['href']) {
        const pathToFile = node.properties['href'];
        if (!fs.existsSync(path.resolve(`./${pathToFile}`))) {
          return;
        }
        const { name, ext } = path.parse(pathToFile);
        const destination = path.resolve(`./dist/${name}${ext}`);
        fs.copyFileSync(pathToFile, destination);
        node.properties['href'] = `/${name}${ext}`;
        delete node.properties['copy'];
        return;
      }
    }
  );
}

module.exports = {
  copyFiles
}