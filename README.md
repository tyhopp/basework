# Basework
An un-opinionated base framework for your web project. Declare a config:

```
framework: react|vue|vanilla
bundler: webpack|parcel|rollup
prefetch: true
prerender: true
structure:
	- pages
	  - index
	    - index.js
	- base.html
	- base.js
```

And start building your project!

### Todos
- [ ] Fix relative paths pointing to target project
- [ ] Ensure POC works with `npm link`
- [ ] Create basic CLI
- [ ] Extract out any target project-specific logic
- [ ] Consume `basework-config.js` from projects
- [ ] Consume `basework-api.js` from projects