const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { getBaseworkConfig } = require(path.resolve(__dirname, 'utils/get-basework-config'));
const { getBaseworkApis } = require(path.resolve(__dirname, 'utils/get-basework-apis'));
const { runBaseworkStep } = require(path.resolve(__dirname, 'utils/run-basework-step'));

const bootstrap = async () => {
  dotenv.config();

  // The default build steps to perform in order
  let steps = [
    'prepare',
    'prefetch',
    'transform',
    'bundle',
    'createPages',
    'prerender'
  ];

  // Use custom build steps provided by config if it exists
  const { build } = await getBaseworkConfig();
  if (build) {
    steps = build;
  }

  buildLoop: for (const step of steps) {
    // Check if step exists in user-defined Basework apis
    const apis = await getBaseworkApis();
    if (apis[step] && typeof apis[step] === 'function') {
      await apis[step]();
      continue buildLoop;
    }

    // Check if step exists in Basework core
    if (fs.existsSync(path.resolve(__dirname, step))) {
      switch (step) {
        case 'prepare':
        case 'bundle':
          await require(path.resolve(__dirname, step))[step]();
          continue buildLoop;
      }
      await runBaseworkStep(step);
      continue buildLoop;
    }

    // If not, log the missing build step
    console.error(`[Error] - Unable to find build step '${step}'`);
  }
}

module.exports = {
  bootstrap
}