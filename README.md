
# Basework 🏗
An un-opinionated base framework for web projects. See [why Basework](docs/why-basework.md) to be sold on the idea.

🚨 Disclaimer - This project is in its early days. Do not use Basework in production.

## Usage
- Install the [Basework CLI](https://github.com/tyhopp/basework-cli) with `npm install -g basework-cli`
- Create a new project with `basework new`
- Enter the project root with `cd basework-example`
- Install the project packages with `npm i`
- Run the project locally with `basework start` to start development
- Open [localhost:8000](http://localhost:8000)

Additionally, build the project locally with `basework build` and check the resulting dist folder to see what the project output looks like.

By building off the example project, you get these [performance benefits](docs/performance.md) out of the box.

## Basework files
There are two files you can add to the root of your project to change the default behavior of Basework:

- `basework-config.js`, which allows you to change bundlers and customize the build process:
	```js
	const baseworkConfig = () => ({
    bundler: 'webpack',
    build: [
      'prepare',
      'prefetch',
      'transform',
      'bundle',
      'create',
      'prerender'
    ]
  });

  module.exports = baseworkConfig;
	```

- `basework-api.js`, which allows you to define custom build steps to run in the build process.

Find more information on what each build step does in the [build step notes](docs/build-steps.md).

## Todos
- [x] Fix relative paths pointing to target project
- [x] Connect projects together locally with `npm pack` and `npm i`
- [x] Create basic CLI
- [x] Extract out any remaining target project-specific logic
- [x] Consume `basework-config.js` from projects
- [x] Consume `basework-api.js` from projects
- [x] Refactor dev server for basic functionality
- [x] Create an example project
- [x] Add a license file
- [x] Publish on npm
- [ ] Proper hot module replacement in the dev server
- [ ] Webpack config differentiated by environment
- [ ] Improve create pages function to support meta tags
- [ ] Support parcel and rollup
- [ ] Improve dev server

## Longer term goals
- [ ] Create a single generalized dev server that works with any bundler
- [ ] Reduce dependency vulnerabilities to zero
- [ ] Add unit and integration tests
- [ ] Add proper CI/CD
- [ ] Create a project generator for React and Vue
- [ ] Introduce an optional `basework-router` implementation for web components, React and Vue
- [ ] Build a dedicated documentation website

## Notes
This project is heavily inspired by [Gatsby](https://gatsby.org).