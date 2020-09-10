<script>
	import Panel from '../../app/Panel.svelte';
	import ChunkyButton from '../../app/ChunkyButton.svelte';
	import FloatingIconButton from '../../app/FloatingIconButton.svelte';

	export let portal;
</script>

<!-- TODO how to handle this? -->
<section class="view">
	<Panel>
		<h1>oh no!</h1>
		<h3>no portal exists at cosmicplayground.org/#{portal.slug}</h3>
		<a href="#home">
			<ChunkyButton>go back home</ChunkyButton>
		</a>
		<h3>if this was my fault im sorry</h3>
	</Panel>
	<div class="sadface">
		<FloatingIconButton on:click={() => alert('D:')}>D:</FloatingIconButton>
	</div>
</section>

<style>
	.view {
		text-align: center;
	}
	.sadface {
		opacity: 0.6;
		display: flex;
		justify-content: center;
	}
</style>
