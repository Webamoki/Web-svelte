import { type } from 'arktype';
import { createSubscriber } from 'svelte/reactivity';

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
		this.#url = `${action}${options.actionName ?? ''}`;
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
			const res = await fetch(this.#url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validated)
			});

			const result = await res.json();

			if (!res.ok) {
				this.#onError?.(result);
				this.#isLoading = false;
				this.#update();
				return;
			}

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
