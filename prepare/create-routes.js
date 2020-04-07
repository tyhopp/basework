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

  const createRouteObject = async pages => {
    let routes = {};
    
    pages.forEach(page => {
      const path = page === 'index' ? '/' : `/${page}`;
      Object.defineProperty(routes, path, {
        value: page,
        writable: false,
        enumerable: true
      });
    });

    return routes;
  }

  const createRouteFile = (pages, routes) => {
    const routesFile = `
      const routes = ${JSON.stringify(routes)};
      const pages = ${JSON.stringify(pages)};

      module.exports = {
        pages,
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
    let routes = await createRouteObject(pages);
    await createRouteFile(pages, routes);
    
    console.log('Routes created');
    return routes;
  }

module.exports = {
  createRoutes
}