const path = require('path');
const fs = require('fs');

  const getSourcePages = () => {
    return new Promise((resolve, reject) => {
      fs.readdir(path.resolve('src/pages'), (error, pages) => {
        if (error) {
          reject(error);
        }
        resolve(pages);
      });
    });
  }

  const createPageIndexFile = pages => {
    const pageIndexFile = `
      const pages = ${JSON.stringify(pages)};

      module.exports = {
        pages
      }
    `;

    return new Promise((resolve, reject) => {
      fs.writeFile(path.resolve('src', 'basework-index.js'), pageIndexFile, error => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }

  const createPageIndex = async () => {
    let pages = await getSourcePages();
    await createPageIndexFile(pages);
    console.log('Basework index created');
  }

module.exports = {
  createPageIndex
}