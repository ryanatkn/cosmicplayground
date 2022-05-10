<script lang="ts">
	import {klona} from 'klona/json';

	import {initialStageData, type StageData} from '$lib/portals/gravity-unlock/stage';
	import GravityUnlockStageBuilder from '$lib/portals/gravity-unlock/GravityUnlockStageBuilder.svelte';
	import Tabs from '$lib/ui/Tabs.svelte';
	import {loadFromStorage, setInStorage} from '$lib/util/storage';

	// TODO store an index and each separate?
	const STORAGE_KEY_STAGES = 'gravity_unlock_stages';
	const STORAGE_KEY_SELECTED_DATA_INDEX = 'gravity_unlock_selected_data_index';
	const STORAGE_KEY_DATA_COUNT = 'gravity_unlock_data_count';

	let selectedDataIndex = loadFromStorage(STORAGE_KEY_SELECTED_DATA_INDEX, 0);
	$: setInStorage(STORAGE_KEY_SELECTED_DATA_INDEX, selectedDataIndex);

	const MAX_DATA_COUNT = 10;
	let dataCount = loadFromStorage(STORAGE_KEY_DATA_COUNT, 0);
	$: setInStorage(STORAGE_KEY_DATA_COUNT, dataCount); // TODO is wasteful on first run

	let datas: StageData[] = Array.from({length: dataCount});
	$: dataCount = datas.length; // does this work? if so, bravo Svelte

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

	const updateSelectedData = (d: StageData) => {
		updateAtIndex(selectedDataIndex, d);
	};
	const updateAtIndex = (index: number, d: StageData) => {
		datas = datas.slice(0, index).concat(d, datas.slice(index + 1));
		setInStorage(`${STORAGE_KEY_STAGES}_${index}`, d);
	};

	const addData = () => {
		if (datas.length >= MAX_DATA_COUNT) return;
		datas = datas.concat(klona(selectedData));
		selectIndex(datas.length - 1);
	};

	// TODO BLOCK either combine tabs with controls in the stage builder or extract elsewhere

	$: console.log(`selectedData`, selectedData);
</script>

<div class="gravity-unlock-studio">
	<!-- TODO key off the `selectedData` or handle it reactively? -->
	<GravityUnlockStageBuilder data={selectedData} on:save={(e) => updateSelectedData(e.detail)}>
		<div class="controls">
			{#if datas.length >= 2}
				<button on:click={() => deleteSelected()}>✕</button>
				<Tabs bind:selectedIndex={selectedDataIndex} items={datas} let:selected let:index>
					<button
						class:selected
						on:click={selected ? undefined : () => selectIndex(index)}
						disabled={selected}>{index + 1}</button
					>
				</Tabs>
			{/if}
			{#if datas.length < MAX_DATA_COUNT}
				<button on:click={() => addData()}>+</button>
			{/if}
		</div>
	</GravityUnlockStageBuilder>
</div>

<style>
	.gravity-unlock-studio {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.controls {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.controls button {
		font-size: var(--font_size_lg);
	}
</style>
