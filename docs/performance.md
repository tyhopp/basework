# Performance features
If you use the Basework project generator (`basework new`), you get these performance features out of the box:

**Code splitting** - load only what you need when you need it:
  - Fewer overall network requests == less bandwidth used
  - Shared resources only loaded once across the site

**Preload/prefetching resources** - ahead-of-time network requests:
  - Requests don't block the thread during render
  - Requests are cached in the browser and load instantaneously

**Prerendering** - build a single-page app without the drawbacks of an SPA:
  - HTML understandable to all search engine crawlers (yay, SEO)
  - Site is usable with JavaScript disabled in the browser
  - As they say, *blazing fast* on first page load 🔥

**Push state routing** - navigation using native browser APIs:
  - Avoids loading all resources each page needs on each navigation
  - Removes flash of white as the page reloads on navigation