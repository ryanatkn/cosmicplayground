<script lang="ts">
	import {get_clock} from '$lib/clock.js';
	import {initialStageData, type StageData} from '$routes/unlock/stage';
	import UnlockStageBuilder from '$routes/unlock/UnlockStageBuilder.svelte';
	import Tabs from '$lib/Tabs.svelte';
	import {loadFromStorage, setInStorage} from '$lib/storage.js';
	import AppDialog from '$lib/AppDialog.svelte';
	import StudioMenu from '$routes/unlock/studio/StudioMenu.svelte';

	// TODO needs a lot of refactoring -- either combine tabs with controls
	// in the stage builder or extract elsewhere

	const clock = clock_context.get();

	// TODO store an index and each separate?
	const STORAGE_KEY_STAGES = 'unlock_stages';
	const STORAGE_KEY_SELECTED_DATA_INDEX = 'unlock_selected_data_index';
	const STORAGE_KEY_DATA_COUNT = 'unlock_data_count';

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
		(datas[selectedDataIndex] = loadFromStorage(
			selectedDataStorageKey,
			structuredClone(initialStageData),
		));

	// TODO extract a custom store to handle this list of items
	const selectIndex = (index: number): void => {
		selectedDataIndex = index;
	};

	const deleteAtIndex = (index: number): void => {
		datas = datas.slice(0, index).concat(datas.slice(index + 1));
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
		datas = datas.concat(structuredClone(selectedData));
		selectIndex(datas.length - 1);
	};
</script>

<div class="unlock-studio">
	<!-- TODO key off the `selectedData` or handle it reactively? -->
	<UnlockStageBuilder data={selectedData} on:save={(e) => updateSelectedData(e.detail)}>
		<div class="controls">
			{#if datas.length >= 2}
				<button title="delete data item" onclick={() => deleteSelected()}>✕</button>
				<Tabs bind:selectedIndex={selectedDataIndex} items={datas} let:selected let:index>
					<button
						class:selected
						onclick={selected ? undefined : () => selectIndex(index)}
						disabled={selected}>{index + 1}</button
					>
				</Tabs>
			{/if}
			{#if datas.length < MAX_DATA_COUNT}
				<button title="add data item" onclick={() => addData()}>+</button>
			{/if}
		</div>
	</UnlockStageBuilder>
</div>
<AppDialog>
	<StudioMenu {clock} />
</AppDialog>

<style>
	.unlock-studio {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.controls {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		z-index: 1;
	}
	.controls button {
		font-size: var(--size_xl4);
		width: var(--size_xl6);
	}
</style>
