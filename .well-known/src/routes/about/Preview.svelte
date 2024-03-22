<script lang="ts">
	import Favicon from '$routes/Favicon.svelte';
</script>

<div class="preview">
	<h1>cosmicplayground</h1>
	<div class="info">
		about
		<div class="box" style:margin="10px"><Favicon size={48} /></div>
		credits
	</div>
</div>

<style>
	.preview {
		padding: 0 var(--portal_padding);
	}
	h1 {
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text_color);
		text-align: center;
		font-weight: 200;
		width: 100%;
	}
	.info {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28px;
		font-weight: 300;
	}
	@media (max-width: 600px) {
		h1 {
			font-size: 40px;
		}
		.info {
			font-size: 24px;
		}
	}
	@media (max-width: 400px) {
		h1 {
			font-size: 32px;
		}
		.info {
			font-size: 20px;
		}
	}
	@media (max-width: 300px) {
		h1 {
			font-size: 26px;
		}
		.info {
			font-size: 16px;
		}
	}
</style>
