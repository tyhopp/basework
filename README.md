
# Basework 🏗
An experimental base framework for web projects. See [why Basework](docs/why-basework.md) to be sold on the idea.

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

## Custom bundler configuration
Basework tries to choose sensible defaults for bundlers. If you need more flexibility, you can add the following files to your project root to add custom configuration to your bundler:

- `webpack-config.js` - base config used by environment specific configs (dev, prod, etc.)
- `webpack-config-dev.js` - config used in development (when running `basework start`)
- `webpack-config-prod.js` - config used in production (when running `basework build`)

These files must export an object or funtion like a normal webpack config.

## Get invovled
This project is mostly a sandbox for new ideas and concepts. If you'd like to collaborate, feel free to open an issue in this repo!

## Todos
- [ ] Proper hot module replacement in the dev server - [impossible with current custom element spec](https://github.com/WICG/webcomponents/issues/829)

## Longer term goals
- [ ] Merge all Basework repos into a single monorepo
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