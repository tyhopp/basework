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

  const createBaseworkIndexFile = pages => {
    const pageIndexFile = `
      const getPages = async () => ${JSON.stringify(pages)};

      module.exports = {
        getPages
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

  const createBaseworkIndex = async () => {
    let pages = await getSourcePages();
    await createBaseworkIndexFile(pages);
    console.log('Basework index created');
  }

module.exports = {
  createBaseworkIndex
}