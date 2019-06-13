# sy<sub><sub>@cosmicplayground</sub></sub>

> a featherweight css styling tool that yields as much control as it can

## motivation

The goal of `sy` is to maximize control and minimize footprint.

## overview

`sy` uses code (js/ts/etc) to generate styles as a build step.
Typical usage has the developer define a config file
that exports a data structure which gets converted into plain css.

The core is small and simple enough to work with most tools,
and it was created to work well with `svelte` and `rollup`.
It was made with the utility class pattern in mind,
but it should work with any styling methodology.

## disclaimer

There are many fantastic tools for working with css,
and you should probably use one of them instead of `sy`.
This library is immature and will change a lot.

## design

At a high level, `sy` is just a function takes a config and returns a build
containing a css string and some descriptive data.
Developers can use the library to generate whatever css they want
using JavaScript. (it's written in and used with TypeScript)
Unlike tools like [tailwindcss](https://github.com/tailwindcss/tailwindcss),
`sy` brings no opinions about class names, responsive design, colors, etc;
all of the control (and work!) is deferred to the developer.

For the standard use case, `sy` is designed to do its work at build time
and integrate seamlessly with other buildtime and runtime tools and processes.
It has no dependencies on any libraries or platform-specific features,
so it can be used at runtime in the browser if that's what a project needs.

`sy` could be described as _css-from-js_,
which provides a lot of the advantages of both _css-in-js_ and plain css.
The distinction from _css-in-js_ is that runtime code need not know anything
about styles, but it can if desired.
Some _css-in-js_ tools leverage a compile step too,
and `sy` doesn't claim any special advantages,
so maybe the _css-from-js_ distinction is a specious one.
In any case, so far it seems pretty great.

## usage

> TODO improve with inline example

See [`src/client/sy.config.ts`](../client/sy.config.ts),
[`rollup-plugin-sy`](../project/build/rollup-plugin-sy.ts),
[`src/project/build/buildStyles.ts`](../project/build/buildStyles.ts),
[`src/project/build/build`](../project/build/build.ts),
and [`rollup-plugin-plain-css`](../project/build/rollup-plugin-plain-css.ts).

## tips

- In dev mode, it can be nice to run
  [`prettier`](https://github.com/prettier/prettier) on the output.
  When not in dev mode, the css output is compact.
