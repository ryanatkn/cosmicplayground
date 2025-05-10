<script lang="ts">
	import EarthMapCredits from '$lib/EarthMapCredits.svelte';

	interface Props {
		show_earth_map_credits?: boolean;
		show_music_credits?: boolean;
	}

	let {show_earth_map_credits = true, show_music_credits = true}: Props = $props();
</script>

{#if show_earth_map_credits}
	<EarthMapCredits />
{/if}
{#if show_music_credits}
	<p>
		<a href="/assets/audio/Alexander_Nakarada__Winter.mp3">"Winter"</a> by Alexander Nakarada,
		<a href="https://www.serpentsoundstudios.com">serpentsoundstudios.com</a>,
		<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
	</p>
{/if}
<p>
	<a href="/assets/audio/ocean_waves.mp3">recording of the ocean waves</a> by
	<a href="https://freesound.org/people/Noted451/sounds/531015/">Noted451 on freesound.org</a>,
	<a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0</a>
</p>
