<script lang="ts">
	import RandomizeSeedButton from '$lib/dealt/RandomizeSeedButton.svelte';
</script>

<footer class="markup">
	<p><a href="https://github.com/feltcoop/dealt">source code and credits</a><br />public domain</p>
	<RandomizeSeedButton />
</footer>

<style>
	footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 60px 0;
		text-align: center;
	}
	a {
		font-size: var(--font_size_xl8);
	}
	p,
	p a {
		font-size: var(--font_size_xl2);
	}
</style>
