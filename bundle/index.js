const path = require('path');
const { getBaseworkConfig } = require(path.resolve(__dirname, '../utils/get-basework-config'));

const bundle = async () => {

  // Check bundler configuration
  const { bundler } = await getBaseworkConfig();
  const unsupportedBundler = !['webpack', 'parcel', 'rollup'].some(supportedBundler => bundler === supportedBundler);
  if (!bundler || unsupportedBundler) {
    console.error(`[Error] - No supported bundler configuration found. Bundler identified is ${bundler}`);
    return;
  }
  
  // Require bundler config and run command
  let bundlerConfig = require(path.resolve(__dirname, `${bundler}/${bundler}-config`));
  const runBundler = require(path.resolve(__dirname, `${bundler}/run-${bundler}`));
  if (typeof bundlerConfig === 'function') {
    bundlerConfig = await bundlerConfig();
  }
  await runBundler(bundlerConfig);
}

module.exports = {
  bundle
}