🚨 This project is no longer actively developed. See it's spiritual successor [PRPL](https://github.com/tyhopp/prpl) instead.

# Basework 🏗

An experimental base framework for web projects. See [why Basework](docs/why-basework.md) to be sold on the idea.

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
      'prerender',
    ],
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

## Notes

This project is heavily inspired by [Gatsby](https://gatsby.org).
