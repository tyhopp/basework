const path = require('path');

const runBaseworkStep = async (step) => {
  const { pages } = require(path.resolve('./src/basework-index.js'));
  stepLoop: for (const page of pages) {
    let arguments = {};

    stepTriage: switch (step) {
      case 'prefetch':
        arguments = {
          page,
          source: path.resolve(`./src/pages/${page}/index.js`),
          data: null
        };
        break stepTriage;
      case 'transform':
      case 'create':
      case 'prerender':
        arguments = {
          page
        };
        break stepTriage;
    }

    await require(path.resolve(__dirname, '..', step))[step](arguments);
  }
}

module.exports = {
  runBaseworkStep
}