# cosmicplayground

[<img src="/src/static/assets/characters/cosmic-kitty.webp" align="right" width="100" height="100">](https://www.cosmicplayground.org)

> tools and toys for expanding minds
> [:milky_way: cosmicplayground.org](https://www.cosmicplayground.org)

[cosmicplayground.org](https://www.cosmicplayground.org)
is a collection of web projects that try to be useful or interesting.
It began as a hobby project with no particular direction,
and it's evolving into something that may become a coherent game experience, or maybe something else?

This is also an experiment in developing an educational project
in public with an open community and open source code.
Join us if you want to improve your webdev skills with Svelte, SvelteKit, and TypeScript
while making games in space!
(community at [cosmicplayground.dev](https://www.cosmicplayground.dev),
[source](https://github.com/cosmicplayground/community),
[contributing.md](https://github.com/cosmicplayground/community/blob/main/contributing.md))

- There's a little action game on the home screen 🛸
  (it's still a work in progress, screencasts to come at the
  [Cosmicplayground Dev Community](https://github.com/cosmicplayground/community) —
  try pressing the escape and backtick keys)
- [Soggy Planet](https://www.cosmicplayground.org/soggy-planet) is an interactive map of Earth
  where sea levels fall and rise and the lights of civilization shine through the night.
  - [Deep Breath](https://www.cosmicplayground.org/deep-breath)
    is an interactive map with a rough answer to the extreme hypothetical
    _"If all ice on Earth melts, how will sea levels change?"_
    It's a more limited precursor to Soggy Planet.
    There's also
    [a video on YouTube with a 6 minute tour](https://www.youtube.com/watch?v=7xEPqg-Kyg4)
    around the planet set to music.
    You can get the same experience by clicking "tour" on the map —
    the visual quality is better on the website but it's not mobile friendly.
- [Starlit Hammock](https://www.cosmicplayground.org/starlit-hammock)
  invites you to sit back and soak in the staggering beauty of space
  as it slowly surveys the skies.
  Space out or zoom and pan around to explore on your own—try to spot your atoms' cousins!
  It displays images from Hubble, [spacetelescope.org](https://www.spacetelescope.org/about/).
  Try it on an idle screen but be mindful of the power usage. :]
  - it's not mobile friendly yet :|
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

- [Cosmicplayground Dev Community](https://github.com/cosmicplayground/community) at [cosmicplayground.dev](https://www.cosmicplayground.dev)
- [YouTube channel](https://www.youtube.com/channel/UCDpSmdzFa_S5BkVlChKU7hg)

[![galaxies](/src/static/assets/space/galaxies-banner.jpg)](/src/static/assets/space/galaxies.jpg)

## develop

> **important**: Windows is not yet supported directly, but Windows users can use
> [WSL](https://docs.microsoft.com/en-us/windows/wsl/about) and other VMs;
> see [this issue](https://github.com/cosmicplayground/cosmicplayground/issues/26) for more

To play with the code, you'll need Node 16.6+;

```bash
npm i
npm start # or gro dev
# open your browser to localhost:3000
npm run build # for production, or gro build
```

> learn more about [Gro](https://github.com/feltcoop/gro)

For full setup instructions from scratch,
see the [cosmicplayground/setup](https://github.com/cosmicplayground/setup) repo.

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
