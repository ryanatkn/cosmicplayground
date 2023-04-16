<script lang="ts">
	import DeepBreathCredits from '$routes/deep-breath/DeepBreathCredits.svelte';

	export let show_tour_credits = false;
</script>

<DeepBreathCredits {show_tour_credits}>
	<p>
		<a href="https://earthobservatory.nasa.gov/features/NightLights">Earth at Night</a> (<a
			href="https://earthobservatory.nasa.gov/features/NightLights/page3.php">flat maps</a
		>) by <a href="https://earthobservatory.nasa.gov/about/michael-carlowicz">Michael Carlowicz</a>,
		<a href="https://earthobservatory.nasa.gov">NASA Earth Observatory</a>
		(2017)
	</p>
</DeepBreathCredits>
