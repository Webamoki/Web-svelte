import { type } from 'arktype';
import { toast } from 'svelte-sonner';
import { defaults, superForm, type SuperValidated } from 'sveltekit-superforms';
import { arktype, arktypeClient } from 'sveltekit-superforms/adapters';
import { dateTransport } from '../datetime/index.js';
export * from './virtual-form.js';
export function prepareForm<S extends type.Any<Record<string, unknown>>>(
	schema: S,
	validated: SuperValidated<S['infer']> | S['infer'],
	options?: Partial<{
		invalidateAll: boolean;
		resetForm: boolean;
		onSuccess: (
			form: Readonly<SuperValidated<S['infer'], App.Superforms.Message, S['infer']>>
		) => void;
		onError: (
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
			if (form.valid && form.message!.success) {
				options?.onSuccess?.(form);
				if (form.message?.text && form.message?.showToast) {
					toast.success(form.message.text);
				}
			} else {
				options?.onError?.(form);
				if (form.message?.text && form.message?.showToast) {
					toast.error(form.message.text);
				}
			}
		},
		onError({ result }) {
			const message = result.error.message ?? 'There was an error submitting the form';
			const status = result.status ?? 500;
			toast.error(`${status} - ${message}`);
		}
	});
	const isProcessing = form.delayed;
	const errors = form.errors;
	return { form, data: form.form, isProcessing, errors };
}

export function prepareEmptyForm<S extends type.Any<Record<string, unknown>>>(
	schema: S,
	options?: Partial<{
		invalidateAll: boolean;
		resetForm: boolean;
		onSuccess: (
			form: Readonly<SuperValidated<S['infer'], App.Superforms.Message, S['infer']>>
		) => void;
		onError: (
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
			if (form.valid && form.message!.success) {
				options?.onSuccess?.(form);
				if (form.message?.text && form.message?.showToast) {
					toast.success(form.message.text);
				}
			} else {
				options?.onError?.(form);
				if (form.message?.text && form.message?.showToast) {
					toast.error(form.message.text);
				}
			}
		},
		onError({ result }) {
			const message = result.error.message ?? 'There was an error submitting the form';
			const status = result.status ?? 500;
			toast.error(`${status} - ${message}`);
		}
	});
	const isProcessing = form.delayed;
	const errors = form.errors;
	return { form, data: form.form, isProcessing, errors };
}
