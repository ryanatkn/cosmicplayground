<script lang="ts">
	interface EntityData {
		id: number;
	}
	interface StageData {
		entities: EntityData[];
	}

	let data: StageData | null = null;
	data = {entities: [{id: 1}, {id: 2}]};

	const exportData = () => {
		prompt('exported data', JSON.stringify(data)); // eslint-disable-line no-alert
	};
	const importData = () => {
		const raw = prompt('imported data', JSON.stringify(data)); // eslint-disable-line no-alert
		if (!raw) return;
		try {
			data = JSON.parse(raw);
		} catch (err) {
			alert('failed to parse'); // eslint-disable-line no-alert
		}
	};
</script>

<button on:click={exportData}>export</button>
<button on:click={importData}>import</button>

<div class="markup">
	<pre>{data ? JSON.stringify(data) : null}</pre>
</div>
