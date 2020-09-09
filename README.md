# cosmicplayground

[<img src="/src/assets/characters/cosmic-kitty.jpg" align="right" width="100">](https://www.cosmicplayground.org)

> tools and toys for expanding minds
> [:milky_way: cosmicplayground.org](https://www.cosmicplayground.org)

[cosmicplayground.org](https://www.cosmicplayground.org)
is a collection of loosely related projects
that try to be useful or interesting in some way.
Here's what I got so far:

- [Deep Breath](https://www.cosmicplayground.org/#deep-breath),
  an interactive map of Earth with a rough answer to the question
  "if all ice on Earth melts, how will sea levels change?"
  The project tries to be interesting and visually pleasing,
  but compared to similar tools it has limited scientific usefulness.
- several unfinished and/or weird things
  (warning: may induce ear discomfort or pain, OKAY??)
- an in-progress ear training game on the `earworm` branch
  that I might continue making one day

[![galaxies](/src/assets/space/galaxies-banner.jpg)](/src/assets/space/galaxies.jpg)

## develop

To play with the code, you'll need Node 14+;

```bash
npm install
npm start
# open your browser to localhost:8999
```

## credits :turtle: <sub>:turtle:</sub><sub><sub>:turtle:</sub></sub>

This project relies on open source software and
[free cultural works](https://creativecommons.org/share-your-work/public-domain/freeworks/)
like [NASA's Hubble imagery](https://www.spacetelescope.org)
and the music of [Alexander Nakarada](https://www.serpentsoundstudios.com).
See [cosmicplayground.org/#about](https://www.cosmicplayground.org/#about)
for the complete list of non-software assets and their credits
and [package.json](package.json) for the code powering things.

made with [Svelte](https://github.com/sveltejs/svelte) ∙
[PixiJS](https://github.com/pixijs/pixi.js) ∙
[TypeScript](https://github.com/microsoft/TypeScript) ∙
[Rollup](https://github.com/rollup/rollup) ∙
[Gro](https://github.com/feltcoop/gro) ∙
[Prettier](https://github.com/prettier/prettier) ∙
[Node](https://nodejs.org) ∙
[GitHub](https://github.com) ∙ [Git](https://git-scm.com/) & more

> :rainbow::sparkles: did you know? emoji can be punctuation :snail: neat huh

## technical notes

### WebGL, Pixi, and bundle sizes

[PixiJS](https://github.com/pixijs/pixi.js) was first added as a dependency to improve
the rendering performance of [Deep Breath](https://www.cosmicplayground.org/#deep-breath),
which animates [fifteen 4096x2048 images](/src/assets/earth/) of Earth
layered together with opacity, scaling, and movement.
The [original DOM implementation](/src/portals/deep-breath/EarthViewerDom.svelte)
has performance problems that range from moderate to severe
and chews up far more GPU resources than necessary. (to the surprise of nobody)

> Firefox runs the DOM version pretty okay on my machine,
> but Chrome chugs and seems shy about using the GPU.
> Pixi makes it smooth on both and gives us access to wonderful goodies like the
> [TilingSprite](http://pixijs.download/release/docs/PIXI.TilingSprite.html)
> and [RenderTexture](http://pixijs.download/release/docs/PIXI.RenderTexture.html)
> which are used to great effect in
> [the Pixi implementation of the Earth map](/src/portals/deep-breath/EarthViewerPixi.svelte).

Pixi is a hefty dependency and roughly tripled the website's JavaScript bundle size
to a total of about 600KB.
The rest of the website uses [Svelte](https://svelte.dev),
whose tiny bundles make this comparison quite painful,
but Pixi delivers graphics that smother the DOM and 2d canvas,
so the tradeoff is well worth it for this app.

The Responsible web developer would perform code splitting and load code only when needed,
but Pixi has already proven useful to render
the app's global background image with buttery smooth animation,
so code splitting isn't going to slim down the bundle sizes to any relative usefulness.
Eventually, I'll probably make the app load non-Pixi code more efficiently,
but for now, enjoy clicking around with loadless transitions!

In summary:

- don't judge Svelte's ability to deliver small websites by looking at this project
- WebGL is good stuff, and Pixi is lovely, but one day I want to explore replacing Pixi
  with [the experimental SvelteJS compiler for WebGL](https://github.com/sveltejs/gl)

## license :bird:

Copyright (c) Ryan Atkinson <mail@ryanatkn.com>
[ryanatkn.com](https://www.ryanatkn.com)

Code is licensed [AGPL-3.0-only](LICENSE).

For the licenses and copyright info of the
graphics, audio, and other non-code assets,
see [cosmicplayground.org/#about](https://www.cosmicplayground.org/#about).
All original assets are licensed
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
unless otherwise specified.

[![galaxies](/src/assets/space/galaxies-banner.jpg)](/src/assets/space/galaxies.jpg)
