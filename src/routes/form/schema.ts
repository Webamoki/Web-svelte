import { CalendarDate, Day, Time } from '$lib/utils/types/arktype.js';
import { type } from 'arktype';

import { PasswordType } from './types/password.js';

export const MasterSchema = type({
	calendarDate: CalendarDate,
	color: type('string').atLeastLength(4).atMostLength(7),
	email: 'string.email',
	emailNull: type('string.email').or(type.null).default(null),
	message: 'string',
	password: PasswordType,
	select: 'number',
	selects: type('number').array(),
	tag: 'string',
	tags: 'string[]>0',
	time: Time,
	weekday: Day,
	weekdays: Day.array().moreThanLength(0)
});

export const TextNullSchema = type({
	emailNull: type('string.email').or(type.null).default(null)
});

export const VirtualFormSchema = type({
	email: 'string.email',
	message: type('string').atLeastLength(10)
});
export const FormSchema = type({
	email: 'string.email',
	message: type('string').atLeastLength(10)
});
