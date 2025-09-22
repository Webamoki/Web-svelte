import { type } from 'arktype';

const passwordMaxLength = 20;
const passwordMinLength = 8;
const allowedChars = /^[A-Za-z0-9!@$#()]+$/;

export const PasswordType = type('string')
	.atLeastLength(passwordMinLength)
	.atMostLength(passwordMaxLength)
	.narrow((data, ctx) => {
		if (!allowedChars.test(data)) {
			return ctx.reject({
				problem: 'invalid_character',
				message: 'Password contains invalid characters. Only A–Z, a–z, 0–9, !@$#() are allowed.'
			});
		}
		if (!/[A-Z]/.test(data)) {
			return ctx.reject({
				problem: 'Must contain at least one uppercase letter.'
			});
		}
		if (!/[a-z]/.test(data)) {
			return ctx.reject({
				problem: 'Must contain at least one lowercase letter.'
			});
		}
		if (!/[0-9]/.test(data)) {
			return ctx.reject({
				problem: 'Must contain at least one number.'
			});
		}
		if (!/[!@$#()]/.test(data)) {
			return ctx.reject({
				problem: 'Must contain at least one special character (!@$#()).'
			});
		}
		return true;
	});
