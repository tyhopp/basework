# Why Basework
Some high-level reasons why Basework might suit your needs:

- **Avoid bundler lock-in.** Architecting your project around a single bundler binds your source code to your tools. Basework decouples this arrangement by making switching bundlers as easy as changing a value in the Basework config.

- **Avoid framework lock-in.** Leveraging frameworks like Gatsby gives you unparalleled functionality out of the box, but also ties you to React. If you've ever wondered "Can I use Gatsby *without* React?", the answer is yes - try Basework.

- **Be effortlessly performant.** It's a massive effort to properly implement advanced concepts like code-splitting, resource preload/prefetching, and prerendering. Instead of spending time to roll your own solutions, Basework can handle it for you.

- **Maintain flexibility.** If you need to extend Basework, you can easily add your own custom build steps in the Basework config. If circumstances demand you migrate away from Basework, its as simple as running `npm uninstall -g basework-cli` and deleting a few `basework-*` files.