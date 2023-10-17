### WebGL, Pixi, and bundle sizes

[PixiJS](https://github.com/pixijs/pixi.js) was first added as a dependency to improve
the rendering performance of [Deep Breath](https://www.cosmicplayground.org/deep-breath),
which animates [fifteen 4096x2048 images of Earth](/static/assets/earth/)
layered together with opacity, scaling, and movement.
The [original DOM implementation](/src/lib/app/EarthViewerDom.svelte)
has performance problems that range from moderate to severe
and chews up far more GPU resources than necessary.
(to the surprise of nobody -
you can test the difference on the map by pressing `ctrl+backtick` and clicking "webgl")

> Firefox runs the DOM version pretty okay on my machine,
> but Chrome chugs and seems shy about using more GPU.
> Pixi makes it smooth on both and provides wonderful goodies like the
> [TilingSprite](https://pixijs.download/release/docs/PIXI.TilingSprite.html)
> and [RenderTexture](https://pixijs.download/release/docs/PIXI.RenderTexture.html)
> which are used in
> [the Pixi implementation of the Earth map](/src/lib/app/EarthViewerPixi.svelte).

Pixi is a hefty dependency and roughly tripled the website's JavaScript bundle size
to a total of about 600KB uncompressed.
The rest of the website uses [Svelte](https://svelte.dev) and [SvelteKit](https://kit.svelte.dev),
whose code-split tiny bundles make this dependency painful in comparison,
but Pixi delivers graphics performance that the DOM and 2d canvas cannot.
I'm no WebGL wizard and Pixi is fast, mature, and well maintained.

In summary: WebGL is good stuff, and Pixi is super, but one day I want to explore replacing Pixi,
maybe with [`@sveltejs/gl`](https://github.com/sveltejs/gl) or
[`svelte-cubed`](https://github.com/Rich-Harris/svelte-cubed).
