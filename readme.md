# cosmicplayground

[<img src="/static/assets/characters/cosmic-kitty.webp" align="right" width="192" height="192">](https://www.cosmicplayground.org)

> tools and toys for expanding minds 🌌
> [cosmicplayground.org](https://www.cosmicplayground.org)

[cosmicplayground.org](https://www.cosmicplayground.org)
is a free and open source noncommercial hobby project exploring
tools and toys with web tech.
It's made with Svelte, SvelteKit, Vite, TypeScript, PixiJS, and _space_.

> **⚠️ update**: I gave up on JS for games because of performance, this project was archived on Svelte 4

- [Soggy Planet](https://www.cosmicplayground.org/soggy-planet) is an interactive map of Earth
  where sea levels rise and fall and the lights of civilization shine through the night.
  It displays sea levels roughly between the
  [lowest point during the last glacial maximum](https://wikipedia.org/wiki/Past_sea_level)
  before the
  [early Holocene sea level rise](https://wikipedia.org/wiki/Early_Holocene_sea_level_rise)
  and one [estimated possible maximum](https://wikipedia.org/wiki/Sea_level_rise).
  - Soggy Planet includes a 3 minute tour of some points of interest related to sea levels
    at the [Last Glacial Maximum](https://wikipedia.org/wiki/Last_Glacial_Maximum)
    ([cosmicplayground.org/soggy-planet](https://www.cosmicplayground.org/soggy-planet),
    [YouTube](https://www.youtube.com/watch?v=akP5J3jfjt4))
- [Starlit Hammock](https://www.cosmicplayground.org/starlit-hammock)
  invites you to sit back and soak in the staggering beauty of space
  as it slowly surveys the skies.
  Space out or zoom and pan around to explore on your own—try to spot your atoms' cousins!
  It displays images from Hubble, [spacetelescope.org](https://www.spacetelescope.org/about/).
  Try it on an idle screen but be mindful of the power usage. :]
- Two tools for understanding
  [the easing functions in Svelte](https://svelte.dev/docs#run-time-svelte-easing)
  (see also [the official example](https://svelte.dev/examples/easing)):
  - [Easing Function Visualizations](https://www.cosmicplayground.org/easings-1)
    compares all easings on a single screen
  - [Easing Function Visualizations and Auralizations](https://www.cosmicplayground.org/easings-2)
    focuses on one function at a time with bigger visuals and a tweakable audio representation
    ([auralization](https://wikipedia.org/wiki/Auralization))

> learn more [about cosmicplayground](https://www.cosmicplayground.org/about)

[![galaxies](/static/assets/space/galaxies-banner.jpg)](/static/assets/space/galaxies.jpg)

## develop

Everything is staticly hosted on GitHub pages,
and there's no 3rd party junk anywhere.

> Windows is not supported directly but
> [WSL](https://docs.microsoft.com/en-us/windows/wsl/about) works, I chose Bash integration instead

```bash
npm i # node 20.10+
npm start # or gro dev
# open your browser to localhost:5173 or whatever it says
npm run build # for production, or gro build
```

> learn more about [Gro](https://github.com/ryanatkn/gro)

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
[@Sinova/Collisions](https://github.com/Sinova/Collisions/) ∙
[TypeScript](https://github.com/microsoft/TypeScript) ∙
[uvu](https://github.com/lukeed/uvu) ∙
[Gro](https://github.com/ryanatkn/gro) ∙
[ESLint](https://github.com/eslint/eslint) ∙
[Prettier](https://github.com/prettier/prettier)
& [more](package.json)

## docs

- [WebGL, Pixi, and bundle sizes](/src/docs/pixi.md)

## license 🐦

code is public domain ⚘ [The Unlicense](license)

For the licenses and copyright info of the
graphics, audio, and other non-code assets,
see [cosmicplayground.org/about](https://www.cosmicplayground.org/about).

[![galaxies](/static/assets/space/galaxies-banner.jpg)](/static/assets/space/galaxies.jpg)
