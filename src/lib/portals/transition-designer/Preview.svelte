<script lang="ts">
	import type {PortalData} from '$lib/portals/portal';

	export const portal: PortalData = undefined as any;
</script>

<div class="preview">
	<h2 class="rotating-text">transition designer</h2>
</div>

<style>
	.preview {
		padding: var(--portal_padding);
	}
	.rotating-text {
		animation: rotate-text 2.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite alternate;
	}
	:global(.paused) .rotating-text {
		animation-play-state: paused;
	}
	@keyframes rotate-text {
		0% {
			transform: rotate3d(-1.35, 4.06, -0.37, 22deg);
		}
		100% {
			transform: rotate3d(1.15, 4.06, -0.37, -18deg);
		}
	}
</style>
