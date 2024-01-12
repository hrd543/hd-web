<script lang="ts">
	import './Two.scss';

	export let reverse = false;
	let className = '';
	export { className as class };
</script>

<div class={`Two${reverse ? ' Two-reverse' : ''} ${className}`}>
	<slot name="0" />
	<slot name="1" />
</div>
