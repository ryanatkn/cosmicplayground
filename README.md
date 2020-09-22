# cosmicplayground

[<img src="/src/assets/characters/cosmic-kitty.jpg" align="right" width="100">](https://www.cosmicplayground.org)

> tools and toys for expanding minds
> [:milky_way: cosmicplayground.org](https://www.cosmicplayground.org)

[cosmicplayground.org](https://www.cosmicplayground.org)
is a collection of web projects that try to be useful or interesting.

- [Deep Breath](https://www.cosmicplayground.org/#deep-breath)
  is an interactive map with a rough answer to the question
  _"If all ice on Earth melts, how will sea levels change?"_
  There's also
  [a video on YouTube with a 6 minute tour](https://www.youtube.com/watch?v=7xEPqg-Kyg4)
  around the planet set to music.
  You can get the same experience by clicking "begin tour" on the map -
  the visual quality is better on the website but it's not mobile friendly.
  Its scentific usefulness is limited but it makes me feel things.
- [Starlit Hammock](https://www.cosmicplayground.org/#starlit-hammock)
  invites you to sit back and soak in the staggering beauty of space
  as it slowly surveys the skies, and you can zoom and pan around to explore on your own.
  It displays images from Hubble, [spacetelescope.org](https://www.spacetelescope.org/about/).
  Why? For me mostly vibes. Looks nice on an idle screen.
  - Safari users: Starlit Hammock only works on iOS 14 and macOS Big Sur
    because it uses webp instead of jpg for better image quality and compression
- Two tools for understanding
  [the easing functions in Svelte](https://svelte.dev/docs#svelte_easing):
  - [Easing Function Visualizations](https://www.cosmicplayground.org/#easings-1)
    compares all easings on a single screen
  - [Easing Function Visualizations and Auralizations](https://www.cosmicplayground.org/#easings-2)
    focuses on one function at a time with bigger visuals and a tweakable audio representation
    ([auralization](https://en.wikipedia.org/wiki/Auralization))
- several odd and partially finished things, some of which require audio to make sense

[![galaxies](/src/assets/space/galaxies-banner.jpg)](/src/assets/space/galaxies.jpg)

## credits :turtle: <sub>:turtle:</sub><sub><sub>:turtle:</sub></sub>

This project relies on open source software and
freely licensed content like [ESA/NASA's Hubble imagery](https://www.spacetelescope.org)
and the music of [Alexander Nakarada](https://www.serpentsoundstudios.com).
See [cosmicplayground.org/#about](https://www.cosmicplayground.org/#about)
for the complete list of non-software assets and their credits.

made with [Svelte](https://github.com/sveltejs/svelte) ∙
[PixiJS](https://github.com/pixijs/pixi.js) ∙
[TypeScript](https://github.com/microsoft/TypeScript) ∙
[Rollup](https://github.com/rollup/rollup) ∙
[Gro](https://github.com/feltcoop/gro) ∙
[Prettier](https://github.com/prettier/prettier) ∙
[Node](https://nodejs.org) & [more](package.json)

## technical notes

### develop

To play with the code, you'll need Node 14+;

```bash
npm i
npm start
# open your browser to localhost:8999
```

### WebGL, Pixi, and bundle sizes

[PixiJS](https://github.com/pixijs/pixi.js) was first added as a dependency to improve
the rendering performance of [Deep Breath](https://www.cosmicplayground.org/#deep-breath),
which animates [fifteen 4096x2048 images of Earth](/src/assets/earth/)
layered together with opacity, scaling, and movement.
The [original DOM implementation](/src/portals/deep-breath/EarthViewerDom.svelte)
has performance problems that range from moderate to severe
and chews up far more GPU resources than necessary.
(to the surprise of nobody -
you can test the difference on the map by pressing `ctrl+backtick` and clicking "webgl")

> Firefox runs the DOM version pretty okay on my machine,
> but Chrome chugs and seems shy about using more GPU.
> Pixi makes it smooth on both and provides wonderful goodies like the
> [TilingSprite](http://pixijs.download/release/docs/PIXI.TilingSprite.html)
> and [RenderTexture](http://pixijs.download/release/docs/PIXI.RenderTexture.html)
> which are used in
> [the Pixi implementation of the Earth map](/src/portals/deep-breath/EarthViewerPixi.svelte).

Pixi is a hefty dependency and roughly tripled the website's JavaScript bundle size
to a total of about 600KB.
The rest of the website uses [Svelte](https://svelte.dev),
whose tiny bundles make this dependency painful in comparison,
but Pixi delivers graphics performance that the DOM and 2d canvas cannot.
I'm no WebGL wizard and Pixi is fast, mature, and well maintained.

The Responsible web developer loads code only when needed through code splitting,
but Pixi proved helpful to render the app's global background image
with buttery smooth animation and low resource usage,
and I plan to use it in many more places.
Code splitting the remaining third of the JavaScript payload
isn't going to give us the slim bundles we're after, so I'm punting the task.
Eventually I'll probably make the app load non-Pixi code more efficiently,
but for now, enjoy clicking around with loadless transitions!

In summary:

- WebGL is good stuff, and Pixi is super, but one day I want to explore replacing Pixi
  with [Svelte for WebGL](https://github.com/sveltejs/gl)
- this app is not representative of Svelte's ability to gracefully scale its JS bundle sizes

## license :bird:

Copyright (c) Ryan Atkinson <mail@ryanatkn.com>
([ryanatkn.com](https://www.ryanatkn.com))

Code is licensed [AGPL-3.0-only](LICENSE).

For the licenses and copyright info of the
graphics, audio, and other non-code assets,
see [cosmicplayground.org/#about](https://www.cosmicplayground.org/#about).
All original assets are licensed
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
unless otherwise specified.

[![galaxies](/src/assets/space/galaxies-banner.jpg)](/src/assets/space/galaxies.jpg)
