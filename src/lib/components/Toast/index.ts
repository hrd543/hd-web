import Toast from './Toast.svelte';
import toasts from './toast.js';
export type { ToastParams } from './types.js';

export default {
	...toasts,
	Container: Toast
};
