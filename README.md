
# Basework 🏗
An un-opinionated base framework for web projects. Basework helps you reduce your exposure to tooling and stay focused on development.

- **Avoid bundler lock-in.** Architecting your project around a single bundler binds your source code to your tools. Basework decouples this arrangement by making switching bundlers as easy as changing a value in the Basework config.

- **Avoid framework lock-in.** Leveraging frameworks like Gatsby gives you unparalleled functionality out of the box, but also ties you to React. If you've ever wondered "Can I use Gatsby *without* React?", the answer is yes - try Basework.

- **Be effortlessly performant.** It's a massive effort to properly implement advanced concepts like code-splitting, resource preload/prefetching, and prerendering. Instead of spending time to roll your own solutions, Basework can handle it for you.

- **Maintain flexibility.** If you need to extend Basework, you can easily add your own custom build steps in the Basework config. If circumstances demand you migrate away from Basework, its as simple as running `npm uninstall -g basework-cli` and deleting a few `basework-*` files.

## Usage
- Install the [Basework CLI](https://github.com/tyhopp/basework-cli) with `npm install -g basework-cli`
- Create a new project with `basework new my-new-site`
- Run the project locally with `basework start` to start development, or
- Build the project locally with `basework build` to see how the project is built.

## Basework files
There are two files you can add to the root of your project to change the behavior of Basework:
- `basework-config.js`, which allows you to change bundlers and customize the build process. It can export a function:

	```js
	const baseworkConfig = () => ({
    bundler: 'webpack',
    build: [
      'prepare',
      'prefetch',
      'transform',
      'bundle',
      'create',
      'createSubPages',
      'prerender'
    ]
  });

  module.exports = baseworkConfig;
	```

  or export a plain object:

  ```js
  module.exports = {
    bundler: 'webpack',
    build: [
      'prepare',
      'prefetch',
      'transform',
      'bundle',
      'create',
      'createSubPages',
      'prerender'
    ]
  };
  ```

- `basework-api.js`, which allows you to define custom build steps to be run in the build process. For example, maybe you want to create additional sub pages at `notes/my-blog-post` instead of just your `notes` page. You can define this functionality here and add the exported function name to the build steps in `basework-config.js`.

## Performance features

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

## Under the hood
When you run `basework build`, Basework performs a series of asynchronous build steps defined in your `basework-config.js` inside the [bootstrap.js](bootstrap.js) file. For each build step defined in the Basework config, the bootstrap file:

  1. First checks if its a custom build step defined in `basework-api.js`, and if so, calls that function.
  2. Then, checks if its a core Basework function, and if so, calls that function.
  3. Finally, if its neither of these, logs an error for an unfound function and moves on to the next step.

When you run `basework start`, a few of these steps are run, and a local development server is started so you can easily change and rebuild your code on the fly.

## Todos
- [x] Fix relative paths pointing to target project
- [x] Connect projects together locally with `npm pack` and `npm i`
- [x] Create basic CLI
- [x] Extract out any remaining target project-specific logic
- [x] Consume `basework-config.js` from projects
- [x] Consume `basework-api.js` from projects
- [x] Refactor dev server for basic functionality
- [ ] Create an example project
- [ ] Add a license file
- [ ] Publish on npm
- [ ] Proper hot module replacement in the dev server
- [ ] Webpack config differentiated by environment
- [ ] Improve create pages function to support meta tags

## Longer term goals
- [ ] Support parcel and rollup
- [ ] Create a single generalized dev server that works with any bundler
- [ ] Reduce dependency vulnerabilities to zero
- [ ] Add unit and integration tests
- [ ] Add proper CI/CD
- [ ] Create a project generator for React and Vue
- [ ] Introduce an optional `basework-router` implementation for web components, React and Vue
- [ ] Build a dedicated documentation website

## Notes
This project is heavily inspired by [Gatsby](https://gatsby.org).