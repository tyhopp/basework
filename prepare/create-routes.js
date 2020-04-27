const path = require('path');
const fs = require('fs');

  const getPages = () => {
    return new Promise((resolve, reject) => {
      fs.readdir(path.resolve('src/pages'), (error, pages) => {
        if (error) {
          reject(error);
        }
        resolve(pages);
      });
    });
  }

  const createRouteFile = routes => {
    const routesFile = `
      const routes = ${JSON.stringify(routes)};

      module.exports = {
        routes
      }
    `;

    return new Promise((resolve, reject) => {
        fs.writeFile(path.resolve('src', 'routes.js'), routesFile, error => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }

  const createRoutes = async () => {
    let pages = await getPages();
    await createRouteFile(pages);
    
    console.log('Routes created');
    return routes;
  }

module.exports = {
  createRoutes
}