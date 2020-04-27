const fs = require('fs');
const path = require('path');

const runBaseworkStep = async (step) => {
  const { pages } = require(path.resolve('./src/basework-index.js'));
  stepLoop: for (const page of pages) {
    let arguments = {};

    stepTriage: switch (step) {
      case 'prefetch':
        arguments = {
          page, // Name of the page, e.g. notes
          source: path.resolve(`./src/pages/${page}/index.js`), // Absolute path to page source code
          data: null // Optional data to create the json file with
        };
        break stepTriage;
    }

    await require(path.resolve(__dirname, '..', step))[step](arguments);
  }
}

module.exports = {
  runBaseworkStep
}