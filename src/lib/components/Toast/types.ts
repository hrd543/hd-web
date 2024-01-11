export type ToastParams = {
	message: string;
	type: 'failure' | 'success' | 'default';
	timoutId: number;
};
