<script lang="ts">
	import {crew} from '$routes/crew.js';
</script>

<div>
	<div class="crew">
		{#each crew as c}
			<div>{c.glyph}</div>
		{/each}
	</div>
</div>

<style>
	.crew {
		border: var(--portal_border);
		border-radius: var(--portal_border_radius);
		font-size: 10rem;
		display: flex;
	}

	@media (max-width: 800px) {
		.crew {
			font-size: 7rem;
		}
	}
	@media (max-width: 600px) {
		.crew {
			font-size: 5rem;
		}
	}
	@media (max-width: 400px) {
		.crew {
			font-size: 4rem;
		}
	}
</style>
