import { DatabaseError } from 'pg';
import { fail, message as superFormMessage, type SuperValidated } from 'sveltekit-superforms';

/**
 * automatically handle database errors from catch.
 * used in form/action handling in page.server.ts
 */
export function handleDbErrorForm<T extends Record<string, unknown>>(
	form: SuperValidated<T>,
	message: string,
	err: unknown
) {
	if (err instanceof DatabaseError) {
		console.error(`Database Error ${message}:`, err);
		return fail(500, { form });
	}

	console.error(`Unexpected Error ${message}:`, err);
	return fail(500, { form });
}

/**
 * check if an error returned by a try catch is a duplicate value error in postgre
 */
export function isDuplicateDbError(err: unknown) {
	return err instanceof DatabaseError && err.code === '23505';
}

export function successMessage<T extends Record<string, unknown>>(form: SuperValidated<T>) {
	return superFormMessage(form, { success: true, showToast: true, text: 'Success' });
}

export function errorMessage<T extends Record<string, unknown>>(
	form: SuperValidated<T>,
	options?: { showToast?: boolean; text?: string; data?: unknown }
) {
	return superFormMessage(form, {
		success: false,
		showToast: options?.showToast ?? false,
		text: options?.text,
		data: options?.data
	});
}

export function failFormValidation<T extends Record<string, unknown>>(form: SuperValidated<T>) {
	return fail(400, { form });
}
