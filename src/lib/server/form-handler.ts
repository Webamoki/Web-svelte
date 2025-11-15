import { DatabaseError } from 'pg';
import {
	fail,
	setError,
	message as superFormMessage,
	type SuperValidated
} from 'sveltekit-superforms';
import { FormError, type VirtualFormValidated } from './form-processor.js';
import { fail as failKit } from '@sveltejs/kit';
/**
 * automatically handle database errors from catch.
 * used in form/action handling in page.server.ts
 */
export function handleDbErrorForm<T extends Record<string, unknown>>(
	form: SuperValidated<T> | VirtualFormValidated<T>,
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
function isVirtualFormValidated<T extends Record<string, unknown>>(
	form: SuperValidated<T> | VirtualFormValidated<T> | FormError
): form is VirtualFormValidated<T> {
	return 'virtual' in form && form.virtual;
}
/**
 * check if an error returned by a try catch is a duplicate value error in postgre
 */
export function isDuplicateDbError(err: unknown) {
	return err instanceof DatabaseError && err.code === '23505';
}

export function successMessage<T extends Record<string, unknown>>(
	form: SuperValidated<T> | VirtualFormValidated<T>,
	options?: { showToast?: boolean; text?: string; data?: unknown }
) {
	const message = {
		success: true,
		showToast: options?.showToast ?? true,
		text: options?.text ?? 'Success',
		data: options?.data
	} as App.Superforms.Message;
	if ('virtual' in form && form.virtual) {
		return message;
	}
	return superFormMessage(form as SuperValidated<T>, message);
}

export function errorMessage<T extends Record<string, unknown>>(
	form: SuperValidated<T> | VirtualFormValidated<T>,
	options?: { showToast?: boolean; text?: string; data?: unknown }
) {
	const message = {
		success: false,
		showToast: options?.showToast ?? false,
		text: options?.text,
		data: options?.data
	} as App.Superforms.Message;
	if (isVirtualFormValidated(form)) {
		return message;
	}
	return superFormMessage(form, message);
}

export function failFormValidation<T extends Record<string, unknown>>(
	form:
		| SuperValidated<T>
		| {
				valid: boolean;
		  }
) {
	if (form.valid) throw new Error('Invalid form passed');
	if (form instanceof FormError) {
		return failKit(400, { message: form.message });
	}
	return fail(400, { form });
}

export function errorField<T extends Record<string, unknown>>(
	form: SuperValidated<T> | VirtualFormValidated<T> | FormError,
	field: keyof T,
	message: string
) {
	if (isVirtualFormValidated(form)) {
		return errorMessage(form, { text: String(field) + ' ' + message });
	}
	if (form instanceof FormError) {
		throw new Error('Cannot set error on form error');
	}
	return setError(form, field as '', message);
}
