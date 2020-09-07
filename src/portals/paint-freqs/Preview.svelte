<script>
	export const portal = undefined;
</script>

<div class="preview">
	<h2>paint freqs</h2>
	<div class="cardboard-box">
		<img
			class="cosmic-kitty"
			src="assets/characters/cosmic-kitty.jpg"
			style="width: 192px; height: 192px;"
			alt="Cosmic Kitty"
		/>
	</div>
</div>

<style>
	.preview {
		padding: var(--portal_padding);
	}
	h2 {
		margin-bottom: 7px;
	}
	.cardboard-box {
		overflow: hidden;
		width: 192px;
		height: 192px;
		border-radius: 50%;
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
