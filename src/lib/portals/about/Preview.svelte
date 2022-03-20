<script lang="ts">
	import type {PortalData} from '$lib/portals/portal';

	export const portal: PortalData = undefined as any;
</script>

<div class="preview">
	<h1>cosmicplayground</h1>
	<h3>
		about <img
			src="/assets/characters/cosm.png"
			alt="cosm"
			class="pixelated"
			style="width: 16px; height: 16px; margin: 0 10px;"
		/>
		credits
		<img
			src="/assets/characters/cosm.png"
			alt="cosm"
			class="pixelated"
			style="width: 16px; height: 16px; margin: 0 10px;"
		/> contact
	</h3>
</div>

<style>
	.preview {
		padding: var(--portal_padding);
	}
	h1 {
		margin-bottom: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text_color);
		text-align: center;
		width: 100%;
	}
	@media (max-width: 600px) {
		h1 {
			font-size: 40px;
		}
		h3 {
			font-size: 24px;
		}
	}
	@media (max-width: 400px) {
		h1 {
			font-size: 32px;
		}
		h3 {
			font-size: 20px;
		}
	}
	@media (max-width: 300px) {
		h1 {
			font-size: 26px;
		}
		h3 {
			font-size: 16px;
		}
	}
</style>
