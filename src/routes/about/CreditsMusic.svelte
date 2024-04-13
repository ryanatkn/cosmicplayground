<script lang="ts">
	import {lookup_song} from '$lib/songs';
	import CreditsMusicAuthor from '$routes/about/CreditsMusicAuthor.svelte';
</script>

<CreditsMusicAuthor author="Alexander Nakarada">
	<svelte:fragment slot="links">
		<ul>
			<li>
				<a href="https://www.serpentsoundstudios.com">serpentsoundstudios.com</a>
			</li>
			<li>
				<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
			</li>
			<li>
				<a href="https://www.youtube.com/channel/UCw4wdHksXbaiyu3BiBNNW0w">YouTube</a>
			</li>
			<li>
				<a href="https://soundcloud.com/serpentsoundstudios">Soundcloud</a>
			</li>
			<li>
				<a href="https://www.patreon.com/anakarada">Patreon</a>
			</li>
			<li><a href="https://twitter.com/thenakarada">Twitter</a></li>
		</ul>
		<p>
			Alexander composed <a href={lookup_song('Spacey Intro').url}>Spacey Intro</a> and
			<a href={lookup_song('Spacey Intro').url}>Spacey Outro</a> with inspiration from cosmicplayground
			💜🌠
		</p>
	</svelte:fragment>
</CreditsMusicAuthor>
<CreditsMusicAuthor author="Rafael Krux">
	<ul slot="links">
		<li>
			<a href="https://www.orchestralis.net">orchestralis.net</a>
		</li>
		<li>public domain</li>
		<li>via <a href="https://freepd.com">freepd.com</a></li>
		<li>
			<a href="https://youtube.com/RafaelKrux">YouTube</a>
		</li>
		<li>
			<a href="https://soundcloud.com/rafael-krux">Soundcloud</a>
		</li>
		<li><a href="https://twitter.com/rkrux">Twitter</a></li>
	</ul>
</CreditsMusicAuthor>
<CreditsMusicAuthor author="Punch Deck">
	<ul slot="links">
		<li>
			<a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>
		</li>
		<li>
			<!-- TODO include these youtube links in the data so they can be generically rendered -->
			<a href="https://www.youtube.com/@PunchDeck">YouTube</a> (<a
				href="https://www.youtube.com/watch?v=hoJE2dWf85U">1</a
			>, <a href="https://www.youtube.com/watch?v=oWLrgj0oo68">2</a>)
		</li>
		<li>
			<a href="https://punchdeck.bandcamp.com/">Bandcamp</a>
		</li>
		<li>
			<a href="https://soundcloud.com/punch-deck">Soundcloud</a>
		</li>
		<li><a href="https://twitter.com/punch_deck">Twitter</a></li>
	</ul>
</CreditsMusicAuthor>
<CreditsMusicAuthor author="Komiku">
	<ul slot="links">
		<li>
			<a href="https://loyaltyfreakmusic.com/">loyaltyfreakmusic.com</a>
		</li>
		<li>public domain</li>
		<li>
			via <a href="https://freepd.com">freepd.com</a>
		</li>
		<li>
			<a href="https://chezmonplaisir.bandcamp.com/">Bandcamp</a>
		</li>
		<li>
			<a href="https://soundcloud.com/alpha-hydrae">Soundcloud</a>
		</li>
		<li>
			<a href="https://twitter.com/rrrrroseazerty">Twitter</a>
		</li>
	</ul>
</CreditsMusicAuthor>
<CreditsMusicAuthor author="Kevin MacLeod">
	<ul slot="links">
		<li>
			<a href="https://incompetech.com">incompetech.com</a>
		</li>
		<li>public domain</li>
		<li>
			via <a href="https://freepd.com">freepd.com</a>
		</li>
		<li>
			<a href="https://www.patreon.com/kmacleod">Patreon</a>
		</li>
		<li>
			<a href="https://twitter.com/kmacleod">Twitter</a>
		</li>
	</ul>
</CreditsMusicAuthor>
<CreditsMusicAuthor author="Phase Shift">
	<ul slot="links">
		<li>public domain</li>
		<li>
			via <a href="https://freepd.com">freepd.com</a>
		</li>
	</ul>
</CreditsMusicAuthor>
