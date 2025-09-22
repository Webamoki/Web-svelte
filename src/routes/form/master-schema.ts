import { type } from 'arktype';
import { PasswordType } from './types/password.js';

export const masterSchema = type({
	email: 'string.email',
	password: PasswordType
});
