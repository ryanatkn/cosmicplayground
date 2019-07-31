<script lang="ts">
	export let name = 'TODO this throws a TS error if not initialized';
	export let num = 1;
	export const up = (v: string): string => v.toUpperCase();
</script>

<span>{name} {up(num)}</span>
