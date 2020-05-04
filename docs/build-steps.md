# Build steps
Basework's default behavior includes 6 build steps that must be run sequentially:
  - prepare
  - prefetch
  - transform
  - bundle
  - create
  - prerender (optional)
  
Here's a breakdown of what each step does:

## Prepare
The prepare step creates `routes.js` file, which contains information about how url paths (e.g. '/'), map to page names (e.g. 'index'). It also keeps a separate list of all pages. The `routes.js` file is used by all other build steps as well as by the router at runtime.

## Prefetch
The prefetch step checks all your pages for a method called `prefetch`. If it exists, it will run that method and save the returned data as a json file to be fetched at runtime when the page is loaded.

TODO - Explore other interfaces for this

```js
  prefetch() { 
    return fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .catch(error => console.error(error));
  }
```

## Transform
The transform function transforms prefetched data. For example, defining a `markdown-to-html` transformation will transform data retrieved as markdown to html.

TODO - Make transformations pluggable

```js
  prefetch() { 
    return fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(data => {
        const transformations = {
          'markdown-to-html': ['data.body'] // The data value to transform
        }
        return { transformations, data }
      })
      .catch(error => console.error(error));
  }
```

## Bundle
The bundle step bundles your site's assets and writes the output to the dist directory. Currently only webpack is supported, but the idea is to support parcel and rollup too in the future.

## Create
The create step constructs the html files for each page. It checks what assets each page needs (e.g. a JavaScript bundle, a CSS file), and adds those tags to the html.

## Prerender
The prerender step uses `jsdom` to run each of your pages ahead of time and updates the html pages after all the assets were loaded. For example, if one of your pages makes a fetch request, builds some DOM elements, and attaches them to the page, the end-state html file will include those DOM elements before any JS is loaded at runtime. This step allows your site to be used even when JavaScript is disabled in the browser and ensures search engine comprehensibility.

The prerender step listens for a custom `basework-complete` event to be fired from your app. It's up to you to determine when to make the dispatch. A common place to fire it would be in your router. If you used the Basework generator, it's already set up for you in the router.

Note - there may be APIs that `jsdom` doesn't cover, and in that case the best option is to open a PR with an appropriate shim.

## A note on custom build steps
You can create a custom build step and make use of the `routes.js` file too, making Basework very flexible. However, be mindful of the order of the steps you define.