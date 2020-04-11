# Basework
An un-opinionated base framework for web projects.

- **Avoid bundler lock-in.** Architecting your project around a single bundler binds your source code to your tooling. Basework decouples this arrangement by making migration as easy as changing a value in a config.

- **Avoid framework lock-in.** Leveraging frameworks like Gatsby gives you unparalleled functionality out of the box, but also ties you to React. If you've ever wondered "Can I use Gatsby without React?", the answer is yes - try Basework.

- **Stay effortlessly performant.** Its a massive effort to properly implement concepts like code-splitting, resource preload/prefetching, and prerendering during the build step. Instead of rolling your own solution, Basework can handle it for you.

## Usage
- Install the [Basework CLI](https://github.com/tyhopp/basework-cli) with `npm install -g basework-cli`
- Create a new project with `basework new my-new-site`
- Run the project locally with `basework start` to start development, or
- Build the project locally with `basework build` to see how the project is built.

### More usage
There are two files you can add to the root of your project to change the behavior of Basework:
- `basework-config.yaml`, which allows you to change bundlers or toggle features and would look something like this:

	```yaml
	bundler: webpack|parcel|rollup
	prefetch: true
	prerender: true
	```

- `basework-api.js`, which allows you to add custom build steps to the build process. For example, maybe you want to create additional sub pages at `notes/my-blog-post` instead of just your `notes` page. You can achieve this here.

### Notes
This project is heavily inspired by [Gatsby](https://gatsby.org).

### Todos
- [x] Fix relative paths pointing to target project
- [x] Connect projects together locally with `npm pack` and `npm i`
- [x] Create basic CLI
- [ ] Extract out any remaining target project-specific logic
- [ ] Consume `basework-config.js` from projects
- [ ] Consume `basework-api.js` from projects