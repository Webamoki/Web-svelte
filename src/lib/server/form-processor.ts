import { dateTransport } from '$lib/utils/datetime/index.js';
import { type } from 'arktype';
import { superValidate } from 'sveltekit-superforms';
import { arktype } from 'sveltekit-superforms/adapters';

export class FormError {
	message: string;
	valid: false;
	constructor(message: string) {
		this.message = message;
		this.valid = false;
	}
}

export type VirtualFormValidated<T extends Record<string, unknown>> = {
	data: T;
	virtual: boolean;
	valid: boolean;
};

export async function processForm<S extends type.Any<Record<string, unknown>>>(
	request: Request,
	schema: S
) {
	let formData;
	try {
		formData = await request.formData();
	} catch (error) {
		return new FormError(error instanceof Error ? error.message : 'Invalid form data');
	}

	if ('__superform_id' in formData) {
		return await superValidate(request, arktype(schema), { transport: dateTransport });
	}

	try {
		// Parse form data and extract the JSON string
		const dataString = formData.get('data');

		if (typeof dataString !== 'string') {
			return new FormError('Missing or invalid data field');
		}

		// Parse the JSON string
		const body = JSON.parse(dataString);

		// Validate against the schema
		const validated = schema(body);

		// Check if validation failed
		if (validated instanceof type.errors) {
			return new FormError(validated.summary);
		}

		// Return validated data
		return {
			data: validated as S['infer'],
			virtual: true,
			valid: true
		} as VirtualFormValidated<S['infer']>;
	} catch (error) {
		return new FormError(error instanceof Error ? error.message : 'Invalid form data');
	}
}
