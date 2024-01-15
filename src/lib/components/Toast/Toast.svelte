<script lang="ts">
	import './Toast.scss';
	import toastsObj from './toast.js';
	import type { ToastParams } from './types.js';

	let className = '';
	export { className as class };

	let toasts: Array<[string, ToastParams]> = [];
	toastsObj.subscribe((newToasts) => {
		toasts = Object.entries(newToasts);
	});
</script>

<div class={`Toast_Container ${className}`}>
	{#each toasts as [toastId, toast] (toastId)}
		<div role="status" class={`Toast Toast--${toast.type}`}>
			{toast.message}
		</div>
	{/each}
</div>
