<script lang="ts">
	import type {PortalData} from '$lib/portals/portal';

	export const portal: PortalData = undefined as any;
</script>

<div class="preview">
	<h2>paint freqs</h2>
	<img
		class="cosmic-kitty"
		src="/assets/characters/cosmic-kitty.webp"
		style="width: 192px; height: 192px;"
		alt="Cosmic Kitty"
	/>
</div>

<style>
	.preview {
		padding: var(--portal_padding);
	}
	h2 {
		margin-bottom: 7px;
	}
	.cosmic-kitty {
		animation: rotate-kitty 2.5s cubic-bezier(0.77, 0, 0.18, 1) infinite alternate;
	}
	:global(.paused) .cosmic-kitty {
		animation-play-state: paused;
	}
	@keyframes rotate-kitty {
		0% {
			transform: rotate3d(0, 0, 1, -2deg);
		}
		100% {
			transform: rotate3d(0, 0, 1, 6deg);
		}
	}
</style>
