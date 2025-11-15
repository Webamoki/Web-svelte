import { type } from 'arktype';
import { createSubscriber } from 'svelte/reactivity';

type SuperFormResult = {
	text: string;
	data: unknown;
	success: boolean;
	showToast: boolean;
};

export class VirtualForm<S extends type.Any<Record<string, unknown>>> {
	// state storage
	#isLoading = false;
	#url = '';
	#schema: S;
	#onSuccess?: (message: App.Superforms.Message) => void;
	#onError?: (message: App.Superforms.Message) => void;

	// svelte reactive tracking
	#subscribe;
	#update = () => {};

	constructor(
		schema: S,
		action: string,
		options: {
			actionName?: string;
			onSuccess?: (message: App.Superforms.Message) => void;
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
			formData.append('data', JSON.stringify(validated));

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

			const parsed: unknown = JSON.parse(result['data']);
			console.log(parsed);
			this.#onSuccess?.(result);
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
