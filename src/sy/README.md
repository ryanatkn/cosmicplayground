# sy<sub><sub>@cosmicplayground</sub></sub>

> a build-time css-in-js (or _css-from-ts_) tool
> aiming for _best-of-all-worlds tradeoffs_

```ts
// work in progress
```

## motivation

`sy` is a css tool with the goal to support powerful, typesafe,
leak-proof abstractions that disappear before runtime to deliver
the best possible UX without compromising much on our precious DX.
Its target audience is developers who are comfortable
with js/ts, build tools, and css heresy.
It leverages build-time scripts and optimizations to
minimize costs while maximizing control, flexibility, and performance.

## key benefits

- only used styles get bundled, so you can go nuts generating tons of css
  and the only cost is a little compilation speed
- flexibility to use whatever patterns and tools a project needs
- excellent interop with js/ts - abstractions can disappear at runtime,
  but you can also import script variables and helpers like any other js/ts
- puts handles directly on the web platform,
  so you can use css features like custom properties (css vars)
  and future stuff without needing to update the library
- utility classes have few of the drawbacks of inline styles and css modules
- types :frog:
- compile-time tools are the forever hotness

## key tradeoffs

- writing styles in js/ts is unfriendly and inaccessible to many css users
- utility classes make some people wretch,
  and others simply prefer writing css and classes -
  `sy` doesn't force them but they seem to be its sweet spot
- lacks css conventions and opinions, leaving most work to you
  and enforcing no standardization across projects,
  so much of "learning `sy`" may not translate between codebases
- you may not be able to unsee a lack of awesomeness in other solutions

## disclaimer

There are many fantastic tools for working with css,
and right now you should probably use one of them instead of `sy`.
This library is immature and will change a lot,
but it is already being used on deployed websites.

## usage

> TODO improve with inline example

See [`src/client/sy.config.ts`](../client/sy.config.ts),
[`rollup-plugin-sy`](../project/build/rollup-plugin-sy.ts),
[`src/project/build/build.ts`](../project/build/build.ts),
[`rollup-plugin-svelte-extract-css-classes`](../project/build/rollup-plugin-svelte-extract-css-classes.ts),
and [`rollup-plugin-plain-css`](../project/build/rollup-plugin-plain-css.ts).

## overview

> TODO clean this up and organize it better

`sy` uses scripts (js/ts/etc) to generate styles as a build step,
or at runtime if that's on the menu.
Typical usage has the developer define a config file
that exports a data structure which gets converted into plain css.

Most css-in-js solutions come with a significant runtime performance penalty,
and most utility class libraries generate large stylesheets
and need a large set of tools.
`sy` uses build-time scripting to get the best of both worlds with little code:
[its `rollup` plugins](../project/build) make it easy to cull unused styles
and compile to plain css, so your users receive the best the web can offer.
It also plays nicely with TypeScript and other typed languages,
so you can enjoy powerfully pleasant tooling and safe refactoring.

At a high level, `sy` is just a function takes a config and returns a build
containing a css string and some descriptive data.
Developers can use the library to generate whatever css they want
using JavaScript. (it's written in and used with TypeScript)
The [`helpers`](helpers.ts) demonstrate some helpful patterns.

`sy` is far simpler than the average css-in-js library -
there are almost no concepts or APIs to learn beyond
the simple data structure that gets converted into css.
Developers can use whatever patterns they like to build that data.
`sy` is similar to [redux](https://github.com/reduxjs/redux)
in that it's less like a library or framework,
and more like a simple pattern with a reference implementation.

For the standard use case, `sy` is designed to do its work at build-time
and integrate seamlessly with other build-time and runtime tools and processes.
It has no dependencies on any libraries or platform-specific features,
so it can be used at runtime in the browser if that's what a project needs.

It was made with the
[utility class pattern](https://css-tricks.com/need-css-utility-library/)
in mind, but it should work with any styling methodology.
The core is small and simple enough to work with most tools,
and it was created to work well with `svelte` and `rollup`.

Unlike tools like [tailwindcss](https://github.com/tailwindcss/tailwindcss),
`sy` brings no opinions about class names, responsive design, colors, etc;
all of the control (and work!) is deferred to the developer.
It's possible to build a library with prescribed conventions on top of `sy`,
but it's also nice to have the low level control and freedom
to experiment and cover those tricky corner cases unique to each app.
Major downsides include the fact that individual codebases using `sy`
may look nothing like each other, each inventing their own conventions,
and a lack of disciplined usage could lead to inconsistency and chaos.

`sy` could be described as _css-from-js_ (or _ts_),
which provides a lot of the advantages of both _css-in-js_ and plain css.
The distinction from _css-in-js_ is that the css comes _from_ scripts,
but runtime scripts don't need to know _anything_ about css or how it's made,
though they _can_ import variables, functions, and other data if needed.
Some _css-in-js_ tools leverage a compile step too,
and `sy` doesn't claim any special advantages,
so maybe the _css-from-js_ distinction is a specious one.
In any case, `sy` hopefully presents a clear philosophy
aiming for _best-of-all-worlds tradeoffs_, and so far it seems pretty great.

## inspirations

- compile-time sourcery: [svelte](https://github.com/sveltejs/svelte),
  macros in lisps and other languages
- utility class libraries:
  [tailwindcss](https://github.com/tailwindcss/tailwindcss),
  [tachyons](https://github.com/tachyons-css/tachyons/)
- css-in-js:
  [styled-components](https://github.com/styled-components/styled-components),
  [emotion](https://github.com/emotion-js/emotion)
- and much more

## tips

- css custom properties are great fun to generate! dark themes ahoy
- while developing, it can be nice to run
  [`prettier`](https://github.com/prettier/prettier) on the css output
- for production, you'll probably want to minify your css with something like
  [`csso`](https://github.com/css/csso)
- you can use `sy` to generate sass/less/postcss/etc,
  but it's also nice to use 100% TypeScript and target the web platform directly
