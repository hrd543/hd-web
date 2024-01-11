<script lang="ts">
	import './Form.scss';
	import { enhance } from '$app/forms';
	import type { FormProps } from './types.js';
	import type { SubmitFunction } from '@sveltejs/kit';

	// Check if the user has started typing
	let startedTyping = 0;

	export let action: string;
	export let hiddenTermsName: string = '';
	// by default, we don't bother checking for time elapsed
	export let minTimeToFillInForm = -1;
	export let onBeforeSubmit: FormProps['onBeforeSubmit'] = undefined;
	export let onAfterSubmit: FormProps['onAfterSubmit'] = undefined;
	let className: string = '';
	export { className as class };

	const enhancer: SubmitFunction = ({ cancel, formElement, formData }) => {
		const timeNow = Date.now();
		// cancel the form submission if not enough time has elapsed
		if (timeNow - startedTyping < minTimeToFillInForm) {
			cancel();
			formElement.reset();
			startedTyping = 0;
		}

		const { cancelSubmit, resetForm } = onBeforeSubmit?.(formData) ?? {};
		if (cancelSubmit) {
			cancel();
		}
		if (resetForm) {
			formElement.reset();
		}

		return ({ update, result }) => {
			onAfterSubmit?.(result);

			update();
		};
	};

	const onFormInput = () => {
		if (!startedTyping) {
			startedTyping = Date.now();
		}
	};
</script>

<form
	method="post"
	use:enhance={enhancer}
	on:input={onFormInput}
	{action}
	class={`Form ${className}`}
>
	<slot />
	{#if hiddenTermsName}
		<div class="Form_Terms">
			<input
				name={hiddenTermsName}
				id="form_terms"
				type="checkbox"
				checked={false}
				autocomplete="off"
			/>
			<label for="form_terms">Do you accept the T&Cs?</label>
		</div>
	{/if}
</form>
