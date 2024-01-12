<script lang="ts">
	import './Four.scss';

	let className = '';
	export { className as class };
</script>

<div class={`Four ${className}`}>
	<div class="Four-left">
		<slot name="0" />
		<slot name="1" />
	</div>
	<div class="Four-right">
		<slot name="2" />
		<slot name="3" />
	</div>
</div>
