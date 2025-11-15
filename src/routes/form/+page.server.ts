import { failFormValidation } from '$lib/server/form-handler.js';
import { processVirtualForm, VirtualFormError } from '$lib/server/form-processor.js';
import { VirtualFormSchema } from './schema.js';

export const actions = {
	default: async ({ request }) => {
		console.log(request);
		const form = await processVirtualForm(request, VirtualFormSchema);
		if (form instanceof VirtualFormError) return failFormValidation(form);
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
