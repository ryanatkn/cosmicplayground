<script lang="ts">
	import DeepBreathCredits from '$routes/deep-breath/DeepBreathCredits.svelte';

	export let showTourCredits = false;
</script>

<DeepBreathCredits {showTourCredits}>
	<p>
		<a href="https://earthobservatory.nasa.gov/features/NightLights">Earth at Night</a> (<a
			href="https://earthobservatory.nasa.gov/features/NightLights/page3.php">flat maps</a
		>) by <a href="https://earthobservatory.nasa.gov/about/michael-carlowicz">Michael Carlowicz</a>,
		<a href="https://earthobservatory.nasa.gov">NASA Earth Observatory</a>
		(2017)
	</p>
</DeepBreathCredits>
