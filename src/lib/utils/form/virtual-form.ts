import { type } from 'arktype';
import { toast } from 'svelte-sonner';
import { createSubscriber } from 'svelte/reactivity';
import { parse, stringify } from 'devalue';
import type { SuperValidated } from 'sveltekit-superforms/client';
import type { Transport } from '@sveltejs/kit';
import { dateTransport } from '../datetime/index.js';

export class VirtualForm<S extends type.Any<Record<string, unknown>>> {
	// state storage
	#isLoading = false;
	#url = '';
	#schema: S;
	#transport: Transport;
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
			transport?: Transport;
			onSuccess?: (
				form: Readonly<SuperValidated<S['infer'], App.Superforms.Message, S['infer']>>
			) => void;
			onError?: (message: App.Superforms.Message) => void;
		} = {}
	) {
		this.#url = `${action}${options.actionName ? '?/' + options.actionName : ''}`;
		this.#schema = schema;
		this.#transport = options.transport ?? dateTransport;
		this.#onSuccess = options.onSuccess;
		this.#onError = options.onError;
		this.#subscribe = createSubscriber((update) => {
			this.#update = update;
			return () => {};
		});
	}

	// Apply transport encoding to data before sending
	#encodeTransport(data: unknown): unknown {
		if (!this.#transport || typeof data !== 'object' || data === null) {
			return data;
		}

		// Handle arrays
		if (Array.isArray(data)) {
			return data.map((item) => this.#encodeTransport(item));
		}

		// Try each transport encoder
		for (const [key, encoder] of Object.entries(this.#transport)) {
			const encoded = encoder.encode(data);
			if (encoded !== false) {
				return { __type: key, __value: encoded };
			}
		}

		// Recursively encode nested objects
		const result: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(data)) {
			result[key] = this.#encodeTransport(value);
		}
		return result;
	}

	// Apply transport decoding to received data
	#decodeTransport(data: unknown): unknown {
		if (!this.#transport || typeof data !== 'object' || data === null) {
			return data;
		}

		// Handle arrays
		if (Array.isArray(data)) {
			return data.map((item) => this.#decodeTransport(item));
		}

		// Check if this is a transport-encoded value
		const obj = data as Record<string, unknown>;
		if (obj.__type && obj.__value && this.#transport[obj.__type as string]) {
			return this.#transport[obj.__type as string].decode(obj.__value);
		}

		// Recursively decode nested objects
		const result: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(obj)) {
			result[key] = this.#decodeTransport(value);
		}
		return result;
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
			// Apply transport encoding before sending
			const encodedData = this.#encodeTransport(validated);

			// Encode JSON as form data (like superforms does)
			const formData = new FormData();
			formData.append('__superform_id', '1');
			formData.append('__superform_json', stringify(encodedData));

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
			// Parse and decode the response
			const parsedData = parse(result['data']);
			const decodedData = this.#decodeTransport(parsedData);
			const form = (decodedData as Record<string, unknown>)['form'] as SuperValidated<
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
