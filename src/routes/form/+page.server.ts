import { type } from 'arktype';
import { PasswordType } from './types/password.js';
import { arktype } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

const masterSchema = type({
	email: 'string.email',
	password: PasswordType
});

export const load = async () => {
	const form = await superValidate(arktype(masterSchema));

	return { form };
};
