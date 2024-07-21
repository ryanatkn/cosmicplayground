<script lang="ts">
</script>

<div class="preview">
	<h2 class="m_0">easing function visualizations</h2>
	<div class="slider-wrapper">
		<div class="slider-graphic" />
	</div>
</div>

<style>
	.preview {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--portal_padding);
	}
	.slider-wrapper {
		margin-top: 3px;
		width: 300px;
		background-color: hsla(var(--space_hue), 60%, 65%, 0.15);
	}
	.slider-graphic {
		animation: slide 5s cubic-bezier(0.645, 0.045, 0.355, 1) infinite alternate;
		width: 12px;
		height: 12px;
		background-color: var(--color_d_5);
	}
	:global(.paused) .slider-graphic {
		animation-play-state: paused;
	}
	@keyframes slide {
		0% {
			transform: translate3d(0, 0, 0);
		}
		100% {
			transform: translate3d(288px, 0, 0);
		}
	}
</style>
