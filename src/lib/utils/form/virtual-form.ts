import { type } from 'arktype';
import { createSubscriber } from 'svelte/reactivity';

function decodeMessage(json: string): App.Superforms.Message {
	const parsed = JSON.parse(json) as unknown[];

	// Basic validation
	if (!Array.isArray(parsed) || typeof parsed[0] !== 'object' || parsed[0] === null) {
		throw new Error('Invalid encoded message format');
	}

	const schema = parsed[0] as Record<string, number>;

	// resolve an index into the parsed array
	const resolve = (idx: number): unknown => (idx >= 0 ? parsed[idx] : undefined);

	const output: Record<string, unknown> = {};

	// dynamically resolve each schema key
	for (const key of Object.keys(schema)) {
		const index = schema[key];
		output[key] = resolve(index);
	}

	return output as App.Superforms.Message;
}
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

			const message = decodeMessage(result['data']);

			if (message.success) {
				this.#onSuccess?.(message);
			} else {
				this.#onError?.(message);
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
