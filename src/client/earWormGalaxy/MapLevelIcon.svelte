<script>
	export let levelDef;
	export let select;
	export let isComplete;
</script>

<div
	on:click={() => select(levelDef)}
	class="absolute cursor-pointer p-8 {isComplete ? 'border-accent' : 'border-primary'}"
	style="left: {levelDef.x}px; top: {levelDef.y}px;">
	<div class="color-primary">{levelDef.id}</div>
</div>
