import { dateTransport } from '$lib/utils/index.js';
import { type } from 'arktype';
import { toast } from 'svelte-sonner';
import { defaults, superForm, superValidate, type SuperValidated } from 'sveltekit-superforms';
import { arktype, arktypeClient } from 'sveltekit-superforms/adapters';

export function prepareForm<S extends type.Any<Record<string, unknown>>>(
	validated: SuperValidated<S['infer']> | S['infer'],
	schema: S,
	options?: Partial<{
		invalidateAll: boolean;
		resetForm: boolean;
		onSuccess: (
			form: Readonly<SuperValidated<S['infer'], App.Superforms.Message, S['infer']>>
		) => void;
	}>
) {
	const form = superForm(validated, {
		validators: arktypeClient(schema),
		dataType: 'json',
		invalidateAll: options?.invalidateAll ?? false,
		transport: dateTransport,
		resetForm: options?.resetForm ?? true,
		onUpdated({ form }) {
			if (form.valid) {
				options?.onSuccess?.(form);
			}
			const text = form.message?.text;
			if (text === undefined || form.message?.showToast === false) return;
			if (form.message!.success) {
				toast.success(text);
			} else {
				toast.error(text);
			}
		},
		onError({ result }) {
			const message = result.error.message ?? 'There was an error submitting the form';
			const status = result.status ?? 500;
			toast.error(`${status} - ${message}`);
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
		resetForm: boolean;
		onSuccess: (
			form: Readonly<SuperValidated<S['infer'], App.Superforms.Message, S['infer']>>
		) => void;
	}>
) {
	const form = superForm(defaults(arktype(schema)), {
		validators: arktypeClient(schema),
		dataType: 'json',
		invalidateAll: options?.invalidateAll === undefined ? false : true,
		transport: dateTransport,
		resetForm: options?.resetForm === undefined ? true : false,
		onUpdated({ form }) {
			if (form.valid) {
				options?.onSuccess?.(form);
			}

			const text = form.message?.text;
			if (text === undefined || form.message?.showToast === false) return;
			if (form.message!.success) {
				toast.success(text);
			} else {
				toast.error(text);
			}
		},
		onError({ result }) {
			const message = result.error.message ?? 'There was an error submitting the form';
			const status = result.status ?? 500;
			toast.error(`${status} - ${message}`);
		}
	});
	const delayed = form.delayed;
	const errors = form.errors;
	return { form, data: form.form, delayed, errors };
}

export async function getServerForm<S extends type.Any<Record<string, unknown>>>(
	request: Request,
	schema: S
) {
	return await superValidate(request, arktype(schema), { transport: dateTransport });
}
