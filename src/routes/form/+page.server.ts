import { arktype } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { masterSchema } from './master-schema.js';

export const load = async () => {
	const form = await superValidate(arktype(masterSchema));

	return { form };
};
