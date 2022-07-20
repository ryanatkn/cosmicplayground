# cosmicplayground

[<img src="/src/static/assets/characters/cosmic-kitty.webp" align="right" width="192" height="192">](https://www.cosmicplayground.org)

> tools and toys for expanding minds
> [:milky_way: cosmicplayground.org](https://www.cosmicplayground.org)

[cosmicplayground.org](https://www.cosmicplayground.org)
is an open source hobby project exploring some
tools and toys using web technology for fun and learning.
It's made with Svelte, SvelteKit, Vite, TypeScript, PixiJS, and _space_.

- There's a little action game on the home screen: to play, click the starship `🛸`.
  It's still a work in progress, and completing the challenge
  grants access to some early previews of stuff.
- [Soggy Planet](https://www.cosmicplayground.org/soggy-planet) is an interactive map of Earth
  where sea levels rise and fall and the lights of civilization shine through the night.
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

> learn more [about cosmicplayground](https://www.cosmicplayground.org/about)
> and [its community](https://github.com/cosmicplayground/community)

[![galaxies](/src/static/assets/space/galaxies-banner.jpg)](/src/static/assets/space/galaxies.jpg)

## develop

Everything is staticly hosted on GitHub pages,
and there's no 3rd party junk anywhere.

> **important**: Windows is not yet supported directly, but Windows users can use
> [WSL](https://docs.microsoft.com/en-us/windows/wsl/about) and other VMs;
> see [this issue](https://github.com/cosmicplayground/cosmicplayground/issues/29) for more

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
[klona](https://github.com/lukeed/klona) ∙
[dequal](https://github.com/lukeed/dequal) ∙
[Gro](https://github.com/feltcoop/gro) ∙
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

made with the help of infinite turtles ∙
[blitwagon.net](https://www.blitwagon.net)

[![galaxies](/src/static/assets/space/galaxies-banner.jpg)](/src/static/assets/space/galaxies.jpg)
