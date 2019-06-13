<script>
	let wrapperWidth, clientWidth, clientHeight;
	const maxWidth = 1667;
	const maxHeight = 781;
	$: width = Math.min(clientWidth, maxWidth);
	$: height = Math.min(clientHeight, maxHeight);
	$: xScale = Math.min(1, width / maxWidth);
	$: yScale = Math.min(1, height / maxHeight);
	$: scale = Math.min(xScale, yScale);
</script>

<div class="wrapper" bind:clientWidth bind:clientHeight>
	<div class="content" style={`transform: scale3d(${scale}, ${scale}, 1);`}>
		<div style={`width: ${maxWidth}px; height: ${maxHeight}px;`}>
			<img
				src="assets/construction/line-1.gif"
				alt="under construction: line 1"
				style="width: 100%"
				class="pixelated" />
			<img
				src="assets/construction/person-dig-idea.gif"
				alt="under construction: person dig idea"
				style="width: 350px; height: 350px;"
				class="pixelated" />
			<img
				src="assets/construction/person-rock.gif"
				alt="under construction: person rock"
				style="width: 60px; height: 37px;"
				class="pixelated" />
			<img
				src="assets/construction/person-dig-fast.gif"
				alt="under construction: person dig fast" />
			<img
				src="assets/construction/person-rock.gif"
				alt="under construction: person rock"
				style="width: 60px; height: 37px;"
				class="pixelated" />
			<img
				src="assets/construction/person-dig-fast.gif"
				alt="under construction: person dig fast" />
			<img
				src="assets/construction/person-dig-fast.gif"
				alt="under construction: person dig fast" />
			<img
				src="assets/construction/person-dig-fast.gif"
				alt="under construction: person dig fast" />
			<img
				src="assets/construction/person-dig-pause.gif"
				alt="under construction: person dig pause"
				style="width: 150px; height: 150px;"
				class="pixelated" />
			<img
				src="assets/construction/person-dig-slow.gif"
				alt="under construction: person dig slow" />
			<img
				src="assets/construction/person-dig-slow.gif"
				alt="under construction: person dig slow" />
			<img
				src="assets/construction/person-dig-slow.gif"
				alt="under construction: person dig slow" />
			<img
				src="assets/construction/person-dig-slow.gif"
				alt="under construction: person dig slow" />
			<img
				src="assets/construction/person-dig-slow.gif"
				alt="under construction: person dig slow" />
			<img
				src="assets/construction/person-dig-slow.gif"
				alt="under construction: person dig slow" />
			<img
				src="assets/construction/person-dig-slow.gif"
				alt="under construction: person dig slow" />
			<img
				src="assets/construction/person-dig-slow.gif"
				alt="under construction: person dig slow" />
			<img
				src="assets/construction/person-dig-pause.gif"
				alt="under construction: person dig pause"
				style="width: 76px; height: 76px; transform: scale3d(-1, 1, 1);"
				class="pixelated" />
			<img
				src="assets/construction/person-dig-slow.gif"
				alt="under construction: person dig slow" />
			<img
				src="assets/construction/person-dig-slow.gif"
				alt="under construction: person dig slow" />
			<img
				src="assets/construction/person-dig-pause.gif"
				alt="under construction: person dig pause" />
			<img
				src="assets/construction/person-dig-slow.gif"
				alt="under construction: person dig slow" />
			<img
				src="assets/construction/person-dig-pause.gif"
				alt="under construction: person dig pause" />
			<img
				src="assets/construction/person-dig-pause.gif"
				alt="under construction: person dig pause" />
			<img
				src="assets/construction/person-dig-quick.gif"
				alt="under construction: person dig quick" />
			<img
				src="assets/construction/person-dig-fast.gif"
				alt="under construction: person dig fast" />
			<img
				src="assets/construction/person-dig-fast.gif"
				alt="under construction: person dig fast" />
			<img
				src="assets/construction/person-computer.gif"
				alt="under construction: person computer"
				style="width: 40px; height: 40px;"
				class="pixelated" />
			<img
				src="assets/construction/person-computer.gif"
				alt="under construction: person computer large"
				style="width: 100px; height: 100px;"
				class="pixelated" />
			<img
				src="assets/construction/person-computer.gif"
				alt="under construction: person computer huge"
				style="width: 300px; height: 300px;"
				class="pixelated" />
			<img
				src="assets/construction/person-dig-pause.gif"
				alt="under construction: person dig pause"
				style="width: 200px; height: 200px;"
				class="pixelated" />
			<img
				src="assets/construction/person-dig-pause.gif"
				alt="under construction: person dig pause"
				style="width: 80px; height: 80px;"
				class="pixelated" />
			<img
				src="assets/construction/person-dig-pause.gif"
				alt="under construction: person dig pause" />
			<div
				style="display: inline-block; height: 100px; position: relative; width:
				240px; transform: rotate(-7deg);">
				<img
					src="assets/construction/line-2.gif"
					alt="under construction: line 2"
					style="width: 90%; position: absolute; top: 38px; left: 5%" />
				<img
					src="assets/construction/line-2.gif"
					alt="under construction: line 2"
					style="width: 80%; position: absolute; bottom: 46px; left: 14%" />
				<img
					src="assets/construction/line-2.gif"
					alt="under construction: line 2"
					style="width: 100%; position: absolute; bottom: 38px; left: 0" />
			</div>
			<div style="position: relative; width: 144px; height: 144px; display: inline-block;">
				<img
					src="assets/construction/mammal.gif"
					alt="under construction: mammal"
					class="pixelated" />
				<a href="https://spiderspace.org">
					<img
						src="assets/characters/spider.png"
						alt="spider"
						style="position: absolute; left: 56px; top: 68px;" />
				</a>
			</div>
			<img
				src="assets/construction/line-2.gif"
				alt="under construction: line 2"
				style="width: 100%; transform: scale3d(1, -1, 1);"
				class="pixelated" />
			<img
				src="assets/construction/line-1.gif"
				alt="under construction: line 1"
				style="width: 100%; position: relative; top: -8px; transform: scale3d(1,
				-1, 1);"
				class="pixelated" />
		</div>
	</div>
</div>

<style>
	.wrapper {
		position: relative;
		z-index: 1;
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
</style>
