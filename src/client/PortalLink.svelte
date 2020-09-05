<script>
	export let name; // TODO validate against the portal data or something

	// TODO lookup from portal data
	const toPortalTitle = (name) =>
		name
			.split('-')
			.map((s) => `${s[0].toUpperCase()}${s.slice(1)}`)
			.join(' ');

	$: title = toPortalTitle(name);
</script>

<a href={`#${name}`}>{title}</a>

<style>
	a {
		background-color: var(--bg_2);
		padding: 0 8px;
		border-radius: 5px;
		color: var(--land_text_color);
		font-weight: bold;
		border: 1px dashed var(--land_text_color);
		text-shadow: var(--text_shadow);
	}
	a:hover {
		border-style: solid; /* too small for double */
	}
	a:active {
		border-style: dotted;
	}
</style>
