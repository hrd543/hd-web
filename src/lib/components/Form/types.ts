import type { ActionResult } from '@sveltejs/kit';

export type FormProps = {
	action: string;
	minTimeToFillInForm?: number;
	hiddenTermsName?: string;
	onBeforeSubmit?: (formData: FormData) => {
		cancelSubmit?: boolean;
		resetForm?: boolean;
	};
	onAfterSubmit?: (result: ActionResult) => void;
};
