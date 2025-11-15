import { errorMessage, failFormValidation, successMessage } from '$lib/server/form-handler.js';
import { processForm } from '$lib/server/form-processor.js';
import { VirtualFormSchema } from './schema.js';

export const actions = {
	normal: async ({ request }) => {
		const form = await processForm(request, VirtualFormSchema);
		if (!form.valid) return failFormValidation(form);
		return errorMessage(form, { showToast: true, text: 'Failed to save changes. Please reload' });

		// const { toAdd, toRemove, force } = form.data;
		// if (!force) {
		// 	const errors = await areChangesCompliant(roster.id, toRemove, toAdd);
		// 	if (errors.length > 0) {
		// 		return errorMessage(form, { data: errors });
		// 	}
		// }
		// try {
		// 	await db.transaction(async (tx) => {
		// 		// Remove assignments
		// 		if (toRemove.length > 0) {
		// 			await tx
		// 				.delete(assignment)
		// 				.where(and(eq(assignment.rosterId, roster.id), inArray(assignment.id, toRemove)));
		// 		}

		// 		// Add assignments
		// 		if (toAdd.length > 0) {
		// 			await tx.insert(assignment).values(
		// 				toAdd.map((a) => ({
		// 					slotId: a.slotId,
		// 					personId: a.personId,
		// 					rosterId: roster.id,
		// 					available: true
		// 				}))
		// 			);
		// 		}
		// 	});
		// } catch (err) {
		// 	if (isDuplicateDbError(err)) {
		// 		return errorMessage(form, { text: 'Failed to save changes. Please reload' });
		// 	}
		// 	return handleDbErrorForm(form, 'saving roster changes', err);
		// }
		// return successMessage(form);
	}
};
