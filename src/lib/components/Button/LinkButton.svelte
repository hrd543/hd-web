<script lang="ts">
	import './Buttons.scss';
	import { LinkButtonProps } from './types.js';
	export let title: LinkButtonProps['title'];
	export let type: LinkButtonProps['type'] = 'outline';
	export let link: LinkButtonProps['link'];
</script>

<a href={link} class={`Button LinkButton Button--${type}`}>{title}</a>
