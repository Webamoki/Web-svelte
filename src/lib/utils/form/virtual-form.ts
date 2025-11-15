import { type } from 'arktype';
import { toast } from 'svelte-sonner';
import { createSubscriber } from 'svelte/reactivity';
import { parse, stringify } from 'devalue';
import type { SuperValidated } from 'sveltekit-superforms/client';

export class VirtualForm<S extends type.Any<Record<string, unknown>>> {
	// state storage
	#isLoading = false;
	#url = '';
	#schema: S;
	#onSuccess?: (
		form: Readonly<SuperValidated<S['infer'], App.Superforms.Message, S['infer']>>
	) => void;
	#onError?: (message: App.Superforms.Message) => void;

	// svelte reactive tracking
	#subscribe;
	#update = () => {};

	constructor(
		schema: S,
		action: string,
		options: {
			actionName?: string;
			onSuccess?: (
				form: Readonly<SuperValidated<S['infer'], App.Superforms.Message, S['infer']>>
			) => void;
			onError?: (message: App.Superforms.Message) => void;
		} = {}
	) {
		this.#url = `${action}${options.actionName ? '?/' + options.actionName : ''}`;
		this.#schema = schema;
		this.#onSuccess = options.onSuccess;
		this.#onError = options.onError;
		this.#subscribe = createSubscriber((update) => {
			this.#update = update;
			return () => {};
		});
	}

	async submit(data: S['infer']) {
		this.#isLoading = true;
		this.#update();
		// Validate data against schema
		const validated = this.#schema(data);
		if (validated instanceof type.errors) {
			console.error('Validation failed:', validated.summary);
			this.#onError?.({
				text: 'Validation failed',
				data: validated.summary,
				success: false,
				showToast: false
			});
			return;
		}
		try {
			// Encode JSON as form data (like superforms does)
			const formData = new FormData();
			formData.append('__superform_id', '1');
			formData.append('__superform_json', stringify(validated));

			const res = await fetch(this.#url, {
				method: 'POST',
				body: formData
			});

			const result = await res.json();
			if (!res.ok || result.status === 400) {
				console.error('Request failed:', result);
				this.#onError?.(result);
				this.#isLoading = false;
				this.#update();
				return;
			}
			const form = parse(result['data'])['form'] as SuperValidated<
				S['infer'],
				App.Superforms.Message,
				S['infer']
			>;
			if (form.valid && form.message?.success) {
				this.#onSuccess?.(form);
				if (form.message.text && form.message.showToast) {
					toast.success(form.message.text);
				}
			} else {
				this.#onError?.(form.message!);
				if (form.message?.text && form.message?.showToast) {
					toast.error(form.message.text);
				}
			}
		} catch (err) {
			console.error(err);
			this.#onError?.({ text: 'Network error', data: err, success: false, showToast: false });
		}
		this.#isLoading = false;
		this.#update();
	}

	get isLoading(): boolean {
		this.#subscribe();
		return this.#isLoading;
	}
}
