<script lang="ts">
	interface Props {
		size: number;
	}

	let {size}: Props = $props();
</script>

<figure style:width="{size}px" style:height="{size}px">
	<img class="favicon" src="/favicon.png" width={size} height={size} alt="cosmicplayground icon" />
	<img
		class="favicon mirror_x"
		src="/favicon.png"
		width={size}
		height={size}
		alt="cosmicplayground icon"
	/>
</figure>

<style>
	figure {
		position: relative;
	}
	.favicon {
		position: absolute;
		left: 0;
		top: 0;
		animation: rotating 391s linear infinite;
		-webkit-user-select: none;
		user-select: none;
	}
	figure .favicon:nth-child(2) {
		opacity: 0.4;
		animation: rotating 252s linear reverse infinite;
	}
</style>
