# cosmicplayground

[<img src="/src/static/assets/characters/cosmic-kitty.webp" align="right" width="100" height="100">](https://www.cosmicplayground.org)

> tools and toys for expanding minds
> [:milky_way: cosmicplayground.org](https://www.cosmicplayground.org)

[cosmicplayground.org](https://www.cosmicplayground.org)
is a collection of web projects that try to be useful or interesting.

- [Soggy Planet](https://www.cosmicplayground.org/soggy-planet) is an interactive map of Earth
  where sea levels fall and rise and the lights of civilization shine through the night.
- There's a little action game on the home screen 🛸
  (it's still a work in progress, screencasts to come at the
  [Cosmicplayground Dev Community](https://github.com/cosmicplayground/dev) --
  try pressing the escape and backtick keys)
- [Deep Breath](https://www.cosmicplayground.org/deep-breath)
  is an interactive map with a rough answer to the extreme hypothetical
  _"If all ice on Earth melts, how will sea levels change?"_
  There's also
  [a video on YouTube with a 6 minute tour](https://www.youtube.com/watch?v=7xEPqg-Kyg4)
  around the planet set to music.
  You can get the same experience by clicking "tour" on the map -
  the visual quality is better on the website but it's not mobile friendly.
- [Starlit Hammock](https://www.cosmicplayground.org/starlit-hammock)
  invites you to sit back and soak in the staggering beauty of space
  as it slowly surveys the skies.
  Space out or zoom and pan around to explore on your own—try to spot your atoms' cousins!
  It displays images from Hubble, [spacetelescope.org](https://www.spacetelescope.org/about/).
  Try it on an idle screen but be mindful of the power usage. :]
  - Safari users: Starlit Hammock uses the modern image format webp instead of jpg,
    which means it only works on iOS 14 & macOS Big Sur or later
- Two tools for understanding
  [the easing functions in Svelte](https://svelte.dev/docs#run-time-svelte-easing)
  (see also [the official example](https://svelte.dev/examples/easing)):
  - [Easing Function Visualizations](https://www.cosmicplayground.org/easings-1)
    compares all easings on a single screen
  - [Easing Function Visualizations and Auralizations](https://www.cosmicplayground.org/easings-2)
    focuses on one function at a time with bigger visuals and a tweakable audio representation
    ([auralization](https://en.wikipedia.org/wiki/Auralization))
- several odd and partially finished things, some of which require audio to make sense,
  and some might not work (or not well) on mobile

## community and screencasts

- [Cosmicplayground Dev Community](https://github.com/cosmicplayground/dev) ∙ [cosmicplayground.dev](https://www.cosmicplayground.dev)
- [YouTube channel](https://www.youtube.com/channel/UCDpSmdzFa_S5BkVlChKU7hg)

[![galaxies](/src/static/assets/space/galaxies-banner.jpg)](/src/static/assets/space/galaxies.jpg)

## credits :turtle: <sub>:turtle:</sub><sub><sub>:turtle:</sub></sub>

This project relies on open source software and
freely licensed content like [ESA/NASA's Hubble imagery](https://www.spacetelescope.org)
and the music of [Alexander Nakarada](https://www.serpentsoundstudios.com).
See [cosmicplayground.org/about](https://www.cosmicplayground.org/about)
for the complete list of non-software assets and their credits.

made with [Svelte](https://github.com/sveltejs/svelte) ∙
[SvelteKit](https://github.com/sveltejs/kit) ∙
[Vite](https://github.com/vitejs/vite) ∙
[PixiJS](https://github.com/pixijs/pixi.js) ∙
[@ryanatkn/collisions](https://github.com/ryanatkn/collisions/) via
[@Sinova/Collisions](https://github.com/Sinova/Collisions/) ∙
[TypeScript](https://github.com/microsoft/TypeScript) ∙
[uvu](https://github.com/lukeed/uvu) ∙
[Gro](https://github.com/feltcoop/gro) ∙
[Prettier](https://github.com/prettier/prettier)
& [more](package.json)

## technical notes

### develop

To play with the code, you'll need Node 14+;

```bash
npm i
npm start
# open your browser to localhost:8999
npm run build # for production
```

## docs

- [WebGL, Pixi, and bundle sizes](/src/docs/pixi.md)

## license 🐦

code is public domain ([The Unlicense](license))

For the licenses and copyright info of the
graphics, audio, and other non-code assets,
see [cosmicplayground.org/about](https://www.cosmicplayground.org/about).

made with the help of infinite turtles ∙
[ryanatkn.com](https://www.ryanatkn.com)

[![galaxies](/src/static/assets/space/galaxies-banner.jpg)](/src/static/assets/space/galaxies.jpg)
