<script lang="ts">
</script>

<div class="preview">
	<h2 class="m_0">paint freqs</h2>
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
		-webkit-user-select: none;
		user-select: none;
		animation: rotate-kitty 6s cubic-bezier(0.77, 0, 0.18, 1) infinite alternate;
	}
	:global(.paused) .cosmic-kitty {
		animation-play-state: paused;
	}
	@keyframes rotate-kitty {
		0% {
			transform: rotate3d(0, 0, 1, -4deg);
		}
		5% {
			transform: rotate3d(0, 0, 1, -3deg);
		}
		35% {
			transform: rotate3d(0, 0, 1, -2deg);
		}
		45% {
			transform: rotate3d(0, 0, 1, 2deg);
		}
		100% {
			transform: rotate3d(0, 0, 1, 2deg);
		}
	}
</style>
