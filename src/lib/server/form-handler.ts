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

export function successMessage<T extends Record<string, unknown>>(
	form: SuperValidated<T>,
	options?: { showToast?: boolean; text?: string; data?: unknown }
) {
	const message = {
		success: true,
		showToast: options?.showToast ?? true,
		text: options?.text ?? 'Success',
		data: options?.data
	} as App.Superforms.Message;
	return superFormMessage(form as SuperValidated<T>, message);
}

export function errorMessage<T extends Record<string, unknown>>(
	form: SuperValidated<T>,
	options?: { showToast?: boolean; text?: string; data?: unknown }
) {
	const message = {
		success: false,
		showToast: options?.showToast ?? false,
		text: options?.text,
		data: options?.data
	} as App.Superforms.Message;
	return superFormMessage(form, message);
}

export function failFormValidation<T extends Record<string, unknown>>(form: SuperValidated<T>) {
	if (form.valid) throw new Error('Invalid form passed');
	return fail(400, { form });
}
