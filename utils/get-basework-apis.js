const fs = require('fs');
const path = require('path');

const getBaseworkApiPath = async () => {
  const apiPath = path.resolve('basework-api.js');
  if (fs.existsSync(apiPath)) {
    return apiPath;
  }
  return null;
}

const getBaseworkApis = async () => {
  let apiPath = await getBaseworkApiPath();
  if (!apiPath) {
    return {};
  }
  const baseworkApis = require(apiPath);
  return baseworkApis;
}

module.exports = {
  getBaseworkApis
}