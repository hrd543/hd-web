import { writable } from 'svelte/store';
import type { ToastParams } from './types.js';
import { generateId } from './helpers.js';

const createToasts = () => {
	const { subscribe, update } = writable<Record<string, ToastParams>>({});

	const add = (message: string, type: ToastParams['type'] = 'default', duration = 5000) => {
		const newId = generateId();
		const timoutId = setTimeout(() => {
			remove(newId);
		}, duration);

		update((toasts) => ({ ...toasts, [newId]: { message, timoutId, type } }));
	};

	const remove = (toastId: string) => {
		update(({ [toastId]: toDelete, ...toasts }) => {
			clearTimeout(toDelete.timoutId);

			return toasts;
		});
	};

	return {
		subscribe,
		add,
		remove
	};
};

export default createToasts();
