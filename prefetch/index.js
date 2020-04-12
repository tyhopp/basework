const path = require('path');
const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const { pages } = require(path.resolve('src/routes'));
const { getBaseworkConfig } = require(path.resolve(__dirname, '../utils/get-basework-config'));

const getPageJavaScript = page => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(`src/pages/${page}/index.js`), (error, js) => {
      if (error) {
        reject(error)
      }
      resolve(js);
    });
  });
}

const parsePrefetchMethod = async (page, buffer) => {
  const code = buffer.toString();

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

  // Ensure fetch file exists
  const ensureExistance = async () => {
    const targetPath = `${path.resolve('dist')}/${page}-prefetch.js`;
    if (!fs.existsSync(targetPath)) {
      const requireStatement = `const fetch = require('node-fetch');`;
      const fnName = page.replace(/[-_]/, '');
      const assignBlock = `const ${fnName}Prefetch = () => `;
      const exportStatement = `module.exports = ${fnName}Prefetch;`;
      const code = `Promise.resolve({});`;
      const final = `${requireStatement}\n\n${assignBlock}${code}\n\n${exportStatement}`;
      fs.writeFileSync(targetPath, final);
    }
  }

  const ast = await createAst();
  await traverseTree(ast);
  await ensureExistance();
}

const createDataFile = page => {
  return new Promise((resolve, reject) => {
    require(`${path.resolve('dist')}/${page}-prefetch.js`)().then(data => {
      fs.writeFile(`${path.resolve('dist')}/${page}-data.json`, JSON.stringify(data), error => {
        if (error) {
          reject(error)
        }
        console.log(`Prefetched ${page} data`);
        resolve();
      });
    });
  });
}

const prefetch = async () => {
  const { prefetch } = await getBaseworkConfig();
  if (!prefetch) {
    return;
  }
  for (const page of pages) {
    const buffer = await getPageJavaScript(page);
    await parsePrefetchMethod(page, buffer);
    await createDataFile(page);
  };
}

module.exports = {
  prefetch
}