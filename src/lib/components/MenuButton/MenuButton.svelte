<script lang="ts">
	import './MenuButton.scss';
	import type { MenuButtonProps } from './types.js';

	export let height: MenuButtonProps['height'];
	export let visible: MenuButtonProps['visible'];
	export let onClick: MenuButtonProps['onClick'];
	let className: MenuButtonProps['class'] = '';
	export { className as class };
</script>

<button class={`MenuButton ${className}`} on:click={onClick}>
	<svg
		version="1.1"
		viewBox="0 0 100 100"
		{height}
		width={height}
		xmlns="http://www.w3.org/2000/svg"
		class="MenuButton_svg"
	>
		<g
			fill="none"
			stroke="#000"
			stroke-width="6.0008"
			class={visible ? 'MenuButton_svg-open' : ''}
		>
			<path
				class="topLine line"
				d="m11.734 23.67h60.008c11.988 0 18.297 30.476 14.506 49.793-0.73988 3.7698-2.739 8.7469-6.5668 9.4714-4.0138 0.75961-7.9004-3.618-7.9004-3.618l-60.046-58.65"
			/>
			<path class="middleLine line" d="m11.734 50h60.008" />
			<path
				class="bottomLine line"
				d="m11.734 76.33h60.007c11.988 0 18.297-30.476 14.506-49.793-0.73988-3.7698-2.739-8.7469-6.5668-9.4714-4.0138-0.75961-7.9004 3.618-7.9004 3.618l-60.046 58.65"
			/>
		</g>
	</svg>
</button>
