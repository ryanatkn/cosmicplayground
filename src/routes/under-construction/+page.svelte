<script lang="ts">
	import {get_clock} from '$lib/clock.js';
	import {get_dimensions} from '$lib/dimensions.js';

	import {freezeframe} from '$lib/freezeframe';

	const clock = get_clock();
	const dimensions = get_dimensions();

	const maxWidth = 1667;
	const maxHeight = 781;
	$: xScale = Math.min(1, $dimensions.width / maxWidth);
	$: yScale = Math.min(1, $dimensions.height / maxHeight);
	$: scale = Math.min(xScale, yScale);

	const toggleClock = () => clock.toggle();

	$: freeze = !$clock.running;
</script>

<div
	class="under-construction"
	style="width: {$dimensions.width}px; height: {$dimensions.height}px;"
	aria-hidden
>
	<div style={`transform: scale3d(${scale}, ${scale}, 1);`}>
		<div style={`width: ${maxWidth}px; height: ${maxHeight}px;`}>
			<div class="row">
				<img
					src="/assets/construction/line-1.gif"
					use:freezeframe={freeze}
					alt="under construction: line 1"
					class="pixelated w-100"
				/>
			</div>
			<div class="row">
				<img
					src="/assets/construction/person-dig-idea.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig idea"
					style="width: 350px; height: 350px;"
					class="pixelated"
				/>
				<button type="button" class="image_button" on:click={toggleClock}>
					<img
						src="/assets/construction/person-rock.gif"
						use:freezeframe={freeze}
						alt="under construction: person rock"
						style="width: 60px; height: 37px;"
						class="pixelated"
					/>
				</button>
				<img
					src="/assets/construction/person-dig-fast.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig fast"
				/>
				<button type="button" class="image_button" on:click={toggleClock}>
					<img
						src="/assets/construction/person-rock.gif"
						use:freezeframe={freeze}
						alt="under construction: person rock"
						style="width: 60px; height: 37px;"
						class="pixelated"
					/>
				</button>
				<img
					src="/assets/construction/person-dig-fast.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig fast"
				/>
				<img
					src="/assets/construction/person-dig-fast.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig fast"
				/>
				<img
					src="/assets/construction/person-dig-fast.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig fast"
				/>
				<img
					src="/assets/construction/person-dig-pause.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig pause"
					style="width: 150px; height: 150px;"
					class="pixelated"
				/>
				<img
					src="/assets/construction/person-dig-slow.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig slow"
				/>
				<img
					src="/assets/construction/person-dig-slow.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig slow"
				/>
				<img
					src="/assets/construction/person-dig-slow.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig slow"
				/>
				<img
					src="/assets/construction/person-dig-slow.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig slow"
				/>
				<img
					src="/assets/construction/person-dig-slow.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig slow"
				/>
				<img
					src="/assets/construction/person-dig-slow.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig slow"
				/>
				<img
					src="/assets/construction/person-dig-slow.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig slow"
				/>
				<img
					src="/assets/construction/person-dig-slow.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig slow"
				/>
				<img
					src="/assets/construction/person-dig-pause.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig pause"
					style="width: 76px; height: 76px; transform: scale3d(-1, 1, 1);"
					class="pixelated"
				/>
			</div>
			<div class="row">
				<img
					src="/assets/construction/person-dig-slow.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig slow"
				/>
				<img
					src="/assets/construction/person-dig-slow.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig slow"
				/>
				<img
					src="/assets/construction/person-dig-pause.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig pause"
				/>
				<img
					src="/assets/construction/person-dig-slow.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig slow"
				/>
				<img
					src="/assets/construction/person-dig-pause.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig pause"
				/>
				<img
					src="/assets/construction/person-dig-pause.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig pause"
					style="transform: scale3d(-1, 1, 1);"
				/>
				<img
					src="/assets/construction/person-dig-quick.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig quick"
				/>
				<img
					src="/assets/construction/person-dig-fast.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig fast"
				/>
				<img
					src="/assets/construction/person-dig-fast.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig fast"
				/>
				<img
					src="/assets/construction/person-computer.gif"
					use:freezeframe={freeze}
					alt="under construction: person computer"
					style="width: 40px; height: 40px;"
					class="pixelated"
				/>
				<img
					src="/assets/construction/person-computer.gif"
					use:freezeframe={freeze}
					alt="under construction: person computer large"
					style="width: 100px; height: 100px;"
					class="pixelated"
				/>
				<img
					src="/assets/construction/person-computer.gif"
					use:freezeframe={freeze}
					alt="under construction: person computer huge"
					style="width: 300px; height: 300px;"
					class="pixelated"
				/>
				<img
					src="/assets/construction/person-dig-pause.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig pause"
					style="width: 200px; height: 200px;"
					class="pixelated"
				/>
				<img
					src="/assets/construction/person-dig-pause.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig pause"
					style="width: 80px; height: 80px;"
					class="pixelated"
				/>
				<img
					src="/assets/construction/person-dig-pause.gif"
					use:freezeframe={freeze}
					alt="under construction: person dig pause"
				/>
				<div
					class="inline-block relative"
					style="height: 100px; width: 240px; transform: rotate(-5deg);"
				>
					<img
						src="/assets/construction/line-2.gif"
						use:freezeframe={freeze}
						alt="under construction: line 2"
						class="absolute"
						style="width: 90%; top: 38px; left: 5%"
					/>
					<img
						src="/assets/construction/line-2.gif"
						use:freezeframe={freeze}
						alt="under construction: line 2"
						class="absolute"
						style="width: 80%; bottom: 46px; left: 14%"
					/>
					<img
						src="/assets/construction/line-2.gif"
						use:freezeframe={freeze}
						alt="under construction: line 2"
						class="w-100 absolute"
						style="bottom: 38px; left: 0"
					/>
				</div>
				<div class="relative inline-block" style="width: 96px; height: 93px;">
					<img
						src="/assets/construction/mammal.gif"
						use:freezeframe={freeze}
						alt="under construction: mammal"
						class="pixelated"
					/>
					<img
						src="/assets/characters/spider.png"
						alt="spiderspace dot org"
						class="absolute cursor-none"
						style="left: 56px; top: 68px;"
						on:click={() => window.open('https://github.com/ryanatkn/fuz_template')}
						aria-hidden
					/>
				</div>
			</div>
			<img
				src="/assets/construction/line-2.gif"
				use:freezeframe={freeze}
				alt="under construction: line 2"
				style="transform: scale3d(1, -1, 1);"
				class="pixelated w-100"
			/>
			<img
				src="/assets/construction/line-1.gif"
				use:freezeframe={freeze}
				alt="under construction: line 1"
				style="top: -8px; transform: scale3d(1, -1, 1);"
				class="pixelated w-100 relative"
			/>
		</div>
	</div>
</div>

<style>
	.under-construction {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	img {
		display: inline-block;
	}
</style>
