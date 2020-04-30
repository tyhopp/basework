const path = require('path');
const fs = require('fs');
const { markdownToHtml } = require('./markdown-to-html');
const { highlightSyntax } = require('./highlight-syntax');

const getPageData = page => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(path.resolve(`dist/${page}-data.json`), (error, json) => {
        if (error) {
          reject(error)
        }
        resolve(json.toString());
      });
    } catch (error) {
      resolve(); // Do nothing, there is no page data
    }
  });
}

// TODO - Refactor
const dig = (ref, section, index, sections, transformationFn) => {
  if (typeof ref[section] === 'string') {
    ref[section] = transformationFn(ref[section]);
  }
  if (typeof ref[section] === 'object') {
    index++
    const nextSection = sections[index];
    if (Array.isArray(ref[section])) {
      ref[section].forEach(refSection => {
        dig(refSection, nextSection, index, sections, transformationFn);
      });
    } else {
      dig(ref[section], nextSection, index, sections, transformationFn);
    }
  }
}

// TODO - Refactor, allow apps to add own transformations
const performTransformations = data => {
  let objectData = JSON.parse(data);
  const transformationObject = objectData.transformations || {};
  if (!Object.keys(transformationObject).length) {
    return JSON.stringify(objectData);
  }
  for (const key in transformationObject) {
    switch (key) {
      case 'markdown-to-html':
        const markdownTransformations = transformationObject[key];
        if (!markdownTransformations) {
          return;
        }
        
        markdownTransformations.forEach(item => {
          const transformationPath = item.split('.');
          let ref = objectData;
          transformationPath.forEach((section, index) => {
            dig(ref, section, index, transformationPath, markdownToHtml);
          });
          objectData = ref;
        });
        break;
      case 'highlight-syntax':
        const highlightTransformations = transformationObject[key];
        if (!highlightTransformations) {
          return;
        }
        
        highlightTransformations.forEach(item => {
          const transformationPath = item.split('.');
          let ref = objectData;
          transformationPath.forEach((section, index) => {
            dig(ref, section, index, transformationPath, highlightSyntax);
          });
          objectData = ref;
        });
        break;
    }
  }
  delete objectData.transformations;
  return JSON.stringify(objectData);
}

const createDataFile = (page, final) => {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFile(path.resolve(`dist/${page}-data.json`), final, error => {
        if (error) {
          reject(error)
        }
        console.log(`Transformed ${page} data`);
        resolve();
      });
    } catch (error) {
      resolve(); // Do nothing, no data to create
    }
  })
}

const transform = async ({ page }) => {
  const data = await getPageData(page);
  const final = await performTransformations(data);
  await createDataFile(page, final);
}

module.exports = {
  transform
}