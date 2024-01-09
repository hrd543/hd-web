<script lang="ts">
	import './Buttons.scss';
	import { ButtonProps } from './types.js';
	export let title: ButtonProps['title'];
	export let type: ButtonProps['type'] = 'outline';
	export let onClick: ButtonProps['onClick'];
</script>

<button class={`Button Button--${type}`} on:click={onClick}>{title}</button>
