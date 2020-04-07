const fs = require('fs');
const path = require('path');

const extractStats = async compilation => {
  let assets = {};
  let assetsMap = {};
  for (let chunkGroup of compilation.chunkGroups) {
    if (chunkGroup.name) {
      let files = [];
      for (let chunk of chunkGroup.chunks) {
        files.push(...chunk.files);
      }
      assets[chunkGroup.name] = files.filter(f => f.slice(-4) !== `.map`);
      assetsMap[chunkGroup.name] = files
        .filter(
          f =>
            f.slice(-4) !== `.map` &&
            f.slice(0, chunkGroup.name.length) === chunkGroup.name
        )
        .map(filename => `/${filename}`);
    }
  }
  const statsFile = `
    const stats = ${JSON.stringify(assetsMap)}

    module.exports = {
      stats
    }
  `;
  fs.writeFileSync(path.resolve('dist/webpack.stats.js'), statsFile);
}

module.exports = {
  extractStats
}