const path = require('path');
const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const getPageJavaScript = source => {
  if (!source) {
    return null;
  }
  return new Promise((resolve, reject) => {
    fs.readFile(source, (error, js) => {
      if (error) {
        reject(error)
      }
      resolve(js.toString());
    });
  });
}

const checkPrefetch = page => {
  return new Promise((resolve, reject) => {
    fs.exists(`${path.resolve('dist')}/${page}-prefetch.js`, (flag, error) => {
      if (error) {
        reject(error);
      }
      resolve(flag);
    });
  })
}

const parsePrefetchMethod = async (page, code) => {
  if (!page || !code) {
    return false;
  }

  const createAst = async () => parser.parse(code, {
    sourceType: 'module',
    allowImportExportEverywhere: true,
    sourceFilename: page
  });
  
  const traverseTree = async ast => traverse(ast, {
    ClassMethod: reference => {
      if (reference.node.key.name === 'prefetch') {
        const code = generate(reference.node.body).code.toString();
        const requireStatement = `const fetch = require('node-fetch');`;
        const assignBlock = `const ${page}Prefetch = () => `;
        const exportStatement = `module.exports = ${page}Prefetch;`;
        const final = `${requireStatement}\n\n${assignBlock}${code}\n\n${exportStatement}`;
        // Only sync code can be run in visitors, see:
        // https://github.com/babel/babel/blob/f6c7bf36cec81baaba8c37e572985bb59ca334b1/packages/babel-traverse/src/path/context.js#L34-L37
        const targetPath = `${path.resolve('dist')}/${page}-prefetch.js`;
        if (!fs.existsSync(path.resolve('dist'))) {
          fs.mkdirSync(path.resolve('dist'));
        }
        fs.writeFileSync(targetPath, final);
      }
    }
  });

  const ast = await createAst();
  await traverseTree(ast);
  const shouldPrefetch = await checkPrefetch(page);
  return shouldPrefetch;
}

const makePrefetch = page => {
  return require(`${path.resolve('dist')}/${page}-prefetch.js`)();
}

const createDataFile = (page, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${path.resolve('dist')}/${page}-data.json`, JSON.stringify(data), error => {
      if (error) {
        reject(error)
      }
      console.log(`Prefetched ${page} data`);
      resolve();
    });
  });
}

const prefetch = async ({ page, source, data = null }) => {
  
  // If data is passed, create data file and return
  if (data) {
    await createDataFile(page, data);
    return;
  }

  // Otherwise, try to run compiler and run prefetch code
  const code = await getPageJavaScript(source);
  const shouldPrefetch = await parsePrefetchMethod(page, code);
  if (shouldPrefetch) {
    const data = await makePrefetch(page);
    await createDataFile(page, data);
    return;
  }

  // If all else fails, create an empty data file
  await createDataFile(page, {});
}

module.exports = {
  prefetch
}