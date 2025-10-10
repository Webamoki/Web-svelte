import { type } from 'arktype';
import { PasswordType } from './types/password.js';
import { CalendarDate, Day, Time } from '$lib/utils/index.js';

export const MasterSchema = type({
	email: 'string.email',
	emailNull: type('string.email').or(type.null).default(null),
	password: PasswordType,
	tag: 'string',
	tags: 'string[]>0',
	weekday: Day,
	weekdays: Day.array().moreThanLength(0),
	color: type('string').atLeastLength(4).atMostLength(7),
	select: 'number',
	selects: type('number').array(),
	time: Time,
	calendarDate: CalendarDate
});

export const TextNullSchema = type({
	emailNull: type('string.email').or(type.null).default(null)
});
