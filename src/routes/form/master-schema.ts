import { type } from 'arktype';
import { PasswordType } from './types/password.js';
import { Day } from '$lib/utils/index.js';

export const masterSchema = type({
	email: 'string.email',
	password: PasswordType,
	tag: 'string',
	tags: 'string[]>0',
	weekday: Day,
	weekdays: Day.array().moreThanLength(0),
	color: type('string').atLeastLength(4).atMostLength(7),
	select: 'number'
});
