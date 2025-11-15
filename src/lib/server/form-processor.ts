import { dateTransport } from '$lib/utils/datetime/index.js';
import { type } from 'arktype';
import { superValidate } from 'sveltekit-superforms';
import { arktype } from 'sveltekit-superforms/adapters';

export class VirtualFormError {
	message: string;

	constructor(message: string) {
		this.message = message;
	}
}

export async function processVirtualForm<S extends type.Any<Record<string, unknown>>>(
	request: Request,
	schema: S
) {
	try {
		// Parse form data and extract the JSON string
		const formData = await request.formData();
		const dataString = formData.get('data');

		if (typeof dataString !== 'string') {
			return new VirtualFormError('Missing or invalid data field');
		}

		// Parse the JSON string
		const body = JSON.parse(dataString);

		// Validate against the schema
		const validated = schema(body);

		// Check if validation failed
		if (validated instanceof type.errors) {
			return new VirtualFormError(validated.summary);
		}

		// Return validated data
		return validated as S['infer'];
	} catch (error) {
		return new VirtualFormError(error instanceof Error ? error.message : 'Invalid form data');
	}
}

export async function processForm<S extends type.Any<Record<string, unknown>>>(
	request: Request,
	schema: S
) {
	return await superValidate(request, arktype(schema), { transport: dateTransport });
}
