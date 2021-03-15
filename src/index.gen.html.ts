import {Gen} from '@feltcoop/gro';
import {renderNoscriptSection} from '@feltcoop/gro/dist/gen/helpers/html.js';

// If this file or one of its dependencies change, be sure to run `gro gen`.
// TODO regenerating should be automated by `gro dev`

export const gen: Gen = () => {
	const title = 'cosmicplayground';
	const sourceCodeUrl = 'https://github.com/ryanatkn/cosmicplayground';
	return `<!DOCTYPE html>
<html lang="en">
	<head>
		<title>${title}</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, shrink-to-fit=no"
    />
		<link rel="shortcut icon" href="/favicon.png" />
    <!-- TODO generate these dynamically and combine in prod -->
		<link rel="stylesheet" href="/bundle.svelte.css" />
		<link rel="stylesheet" href="/bundle.sy.css" />
		<link rel="stylesheet" href="/bundle.plain.css" />
	</head>
	<body>
    <div id="root">
      <noscript>
        <div
          class="overflow-hidden my-0 mx-auto w-50 h-50"
          style="border-radius: 50%;"
        >
          <img
            src="/assets/characters/cosmic-kitty.webp"
            class="w-50 h-50"
            alt="Cosmic Kitty"
          />
        </div>
      </noscript>
      ${renderNoscriptSection(sourceCodeUrl)}
		</div>
		<script src="index.js" type="module"></script>
	</body>
</html>
`;
};
