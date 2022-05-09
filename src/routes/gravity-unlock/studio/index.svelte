<script lang="ts">
	import {klona} from 'klona/json';

	import {initialStageData, type StageData} from '$lib/portals/gravity-unlock/stage';
	import GravityUnlockStageBuilder from '$lib/portals/gravity-unlock/GravityUnlockStageBuilder.svelte';
	import Tabs from '$lib/ui/Tabs.svelte';
	import {loadFromStorage, setInStorage} from '$lib/util/storage';

	// TODO store an index and each separate?
	const STORAGE_KEY_STAGES = 'gravity_unlock_stages';
	const STORAGE_KEY_SELECTED_DATA_INDEX = 'gravity_unlock_selected_data_index';

	let datas: StageData[] = [];

	let selectedDataIndex = loadFromStorage(STORAGE_KEY_SELECTED_DATA_INDEX, 0);
	$: setInStorage(STORAGE_KEY_SELECTED_DATA_INDEX, selectedDataIndex);

	$: selectedDataStorageKey = `${STORAGE_KEY_STAGES}_${selectedDataIndex}`;
	$: selectedData =
		datas[selectedDataIndex] ||
		(datas[selectedDataIndex] = loadFromStorage(selectedDataStorageKey, klona(initialStageData)));

	const selectIndex = (index: number): void => {
		selectedDataIndex = index;
	};

	const deleteAtIndex = (index: number): void => {
		console.log(`datas`, index, datas);
		datas = datas.slice(0, index).concat(datas.slice(index + 1));
		console.log(`datas after`, datas);
		if (selectedDataIndex >= datas.length) selectedDataIndex--;
	};
	const deleteSelected = (): void => {
		deleteAtIndex(selectedDataIndex);
	};

	const addData = () => {
		datas = datas.concat(klona(selectedData));
		selectIndex(datas.length - 1);
	};
</script>

<div class="gravity-unlock-studio">
	<ul class="controls">
		{#if datas.length >= 2}
			<button on:click={() => deleteSelected()}>✕</button>
			<Tabs bind:selectedIndex={selectedDataIndex} items={datas} let:selected let:index>
				<button
					class:selected
					on:click={selected ? undefined : () => selectIndex(index)}
					disabled={selected}>{index}</button
				>
			</Tabs>
		{/if}
		<button on:click={() => addData()}>+</button>
	</ul>
	<!-- TODO key off the `selectedData` or handle it reactively? -->
	<GravityUnlockStageBuilder
		data={selectedData}
		on:save={(e) => setInStorage(selectedDataStorageKey, e.detail)}
	/>
</div>

<style>
	.gravity-unlock-studio {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.controls {
		position: absolute;
		z-index: 1;
		width: 100%;
		display: flex;
		justify-content: center;
	}
	.controls button {
		font-size: var(--font_size_lg);
	}
</style>
