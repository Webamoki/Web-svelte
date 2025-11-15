import { failFormValidation, successMessage } from '$lib/server/form-handler.js';
import { processForm } from '$lib/server/form-processor.js';
import { VirtualFormSchema } from './schema.js';

export const actions = {
	normal: async ({ request }) => {
		const form = await processForm(request, VirtualFormSchema);
		if (!form.valid) return failFormValidation(form);
		return successMessage(form, { showToast: true, text: 'Failed to save changes. Please reload' });
	}
};
