
# Basework 🏗
An un-opinionated base framework for web projects.

- **Avoid bundler lock-in.** Architecting your project around a single bundler binds your source code to your tooling. Basework decouples this arrangement by making switching bundlers as easy as changing a value in a config.

- **Avoid framework lock-in.** Leveraging frameworks like Gatsby gives you unparalleled functionality out of the box, but also ties you to React. If you've ever wondered "Can I use Gatsby without React?", the answer is yes - try Basework.

- **Stay effortlessly performant.** Its a massive effort to properly implement advanced concepts like code-splitting, resource preload/prefetching, and prerendering. Instead of spending the time to roll your own solutions, Basework can handle it for you.

- **Trivial migration.** If circumstances demand you migrate away from Basework, its as simple as `npm uninstall -g basework-cli` and deleting a few `basework-*` files. With Basework your project is untouched by tooling, making it trivially easy to swap back to a traditional setup if you need to.

## Usage
- Install the [Basework CLI](https://github.com/tyhopp/basework-cli) with `npm install -g basework-cli`
- Create a new project with `basework new my-new-site`
- Run the project locally with `basework start` to start development, or
- Build the project locally with `basework build` to see how the project is built.

## Basework files
There are two files you can add to the root of your project to change the behavior of Basework:
- `basework-config.js`, which allows you to change bundlers or toggle features. It would look something like this if you want to export a function:

	```js
	const baseworkConfig = () => ({
    bundler: 'webpack',
    prefetch: true,
    prerender: true
  });

  module.exports = baseworkConfig;
	```

  or like this if you want to export a plain object:

  ```js
  module.exports = {
    bundler: 'webpack',
    prefetch: true,
    prerender: true
  };
  ```

- `basework-api.js`, which allows you to add custom build steps to the build process. For example, maybe you want to create additional sub pages at `notes/my-blog-post` instead of just your `notes` page. You can achieve this here.

TODO - Add more documentation when api is refined

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
When you run `basework build`, Basework performs a series of asynchronous build steps that you can see clearly in the [bootstrap.js](bootstrap.js) file. Rather than listing them here, it's much easier to view the file directly.

When you run `basework start`, a few of these steps are run, and a local development server is started so you can easily change and rebuild your code on the fly.

## Todos
- [x] Fix relative paths pointing to target project
- [x] Connect projects together locally with `npm pack` and `npm i`
- [x] Create basic CLI
- [x] Extract out any remaining target project-specific logic
- [x] Consume `basework-config.js` from projects
- [ ] Consume `basework-api.js` from projects
- [x] Refactor dev server for basic functionality
- [ ] Proper hot module replacement in the dev server
- [ ] Webpack config differentiated by environment
- [ ] Improve create pages function to support meta tags
- [ ] Create example project
- [ ] Publish on npm

## Longer term goals
- [ ] A single generalized dev server that works with any bundler
- [ ] Reduce dependency vulnerabilities to zero
- [ ] Unit and integration tests
- [ ] Proper CI/CD
- [ ] Project generator for web components, React and Vue
- [ ] An optional `basework-router` implementation for webcomponents, React and Vue
- [ ] A dedicated documentation website

## Notes
This project is heavily inspired by [Gatsby](https://gatsby.org).