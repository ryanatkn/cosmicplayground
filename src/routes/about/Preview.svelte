<script lang="ts">
</script>

<div class="preview">
	<h1>cosmicplayground</h1>
	<div class="info">
		about
		<img
			src="/assets/icon.png"
			alt="cosmicplayground icon"
			width="32"
			height="32"
			style:margin="10px"
		/>
		credits
		<img
			src="/assets/icon.png"
			alt="cosmicplayground icon"
			width="32"
			height="32"
			style:margin="10px"
		/>
		contact
	</div>
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
