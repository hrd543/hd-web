<script lang="ts">
	import './Header.scss';
	import MenuButton from '../MenuButton/index.js';
	import type { HeaderItem } from './types.js';

	export let items: HeaderItem[];
	export let logo: string;
	export let menuSize = 30;

	let linksVisible = false;
</script>

<nav class="Header">
	<div class="Header_container">
		<div class="Header_logo">{logo}</div>
		<ul class={`Header_links${linksVisible ? ' Header_links-show' : ''}`}>
			{#each items as item (item.link)}
				<li class="Header_item">
					<a
						on:click={() => {
							linksVisible = false;
						}}
						href={item.link}>{item.title}</a
					>
				</li>
			{/each}
		</ul>
		<MenuButton
			height={menuSize}
			visible={linksVisible}
			onClick={() => (linksVisible = !linksVisible)}
			class="Header_menuButton"
		/>
	</div>
</nav>
