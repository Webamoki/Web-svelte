import { toast } from 'svelte-sonner';
import { dateTransport } from '$lib/utils/index.js';
import { type } from 'arktype';
import {
	defaults,
	fail,
	superForm,
	superValidate,
	type SuperValidated
} from 'sveltekit-superforms';
import { arktype, arktypeClient } from 'sveltekit-superforms/adapters';
import { Time } from '@internationalized/date';

export function prepareForm<S extends type.Any<Record<string, unknown>>>(
	validated: SuperValidated<S['infer']> | S['infer'],
	schema: S,
	options?: Partial<{
		invalidateAll: boolean;
		onSuccess: (
			form: Readonly<SuperValidated<S['infer'], App.Superforms.Message, S['infer']>>
		) => void;
	}>
) {
	const _invalidateAll = options?.invalidateAll === undefined ? false : true;
	const form = superForm(validated, {
		validators: arktypeClient(schema),
		dataType: 'json',
		invalidateAll: _invalidateAll,
		transport: dateTransport,
		onUpdated({ form }) {
			if (form.valid) {
				options?.onSuccess?.(form);
			}
			const text = form.message?.text;
			if (text === undefined) return;

			if (form.message?.success) {
				toast.success(text);
			} else {
				toast.error(text);
			}
		}
	});
	const delayed = form.delayed;
	const errors = form.errors;
	return { form, data: form.form, delayed, errors };
}

export function prepareEmptyForm<S extends type.Any<Record<string, unknown>>>(
	schema: S,
	options?: Partial<{
		invalidateAll: boolean;
		onSuccess: (
			form: Readonly<SuperValidated<S['infer'], App.Superforms.Message, S['infer']>>
		) => void;
	}>
) {
	const _invalidateAll = options?.invalidateAll === undefined ? false : true;
	const form = superForm(defaults(arktype(schema)), {
		validators: arktypeClient(schema),
		dataType: 'json',
		invalidateAll: _invalidateAll,
		transport: dateTransport,
		onUpdated({ form }) {
			if (form.valid) {
				options?.onSuccess?.(form);
			}

			const text = form.message?.text;
			if (text === undefined) return;

			if (form.message?.success) {
				toast.success(text);
			} else {
				toast.error(text);
			}
		}
	});
	const delayed = form.delayed;
	const errors = form.errors;
	return { form, data: form.form, delayed, errors };
}

export async function serverValidateForm<S extends type.Any<Record<string, unknown>>>(
	request: Request,
	schema: S
) {
	const form = await superValidate(request, arktype(schema), { transport: dateTransport });
	if (!form.valid) {
		throw fail(400, { form });
	}
	return form;
}
