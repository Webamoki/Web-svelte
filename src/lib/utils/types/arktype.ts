import { Type, type } from 'arktype';
import { Days } from '../datetime/index.js';
import { Time as timeImport, CalendarDate as calendarImport } from '@internationalized/date';
import { EMAIL_MAX, FIRST_NAME_MAX, LAST_NAME_MAX, NAME_MAX } from './consts.js';
import { toTitleCase } from '../string.js';

// Phone arktype: allows "+", digits, and spaces only
export const Phone = type('string').narrow((value, ctx) => {
	if (!/^[+0-9 ]+$/.test(value)) {
		return ctx.reject({
			problem: 'invalid phone number. Only +, digits, and spaces are allowed.'
		});
	}
	return true;
});

/** Type string which is trimmed before narrowing the type checking */
export function trimTo(typeTo: Type<string>) {
	return type('string.trim').to(typeTo);
}

export const Day = type.enumerated(...Days);
export type Day = (typeof Days)[number];

export const Time = type.instanceOf(timeImport).configure({
	problem: () => 'invalid time'
});

export const CalendarDate = type.instanceOf(calendarImport).configure({
	problem: () => 'invalid date'
});

export const HexColor = type('string').narrow((value, ctx) => {
	// Regex explanation:
	// ^           : start of string
	// [0-9A-Fa-f]{3} : three hex digits (short form)
	// ([0-9A-Fa-f]{3})? : optional three more digits (long form #RRGGBB)
	// $           : end of string
	if (!/^[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/.test(value)) {
		return ctx.reject({
			problem: 'invalid hex color value'
		});
	}
	return true;
});

export const Email = trimTo(
	type('string.email')
		.configure({
			problem: () => 'invalid email address'
		})
		.atMostLength(EMAIL_MAX)
).pipe((email) => email.toLowerCase());

export const Name = trimTo(type.string.moreThanLength(0).atMostLength(NAME_MAX)).pipe(toTitleCase);

export const FirstName = trimTo(type.string.moreThanLength(0).atMostLength(FIRST_NAME_MAX)).pipe(
	toTitleCase
);
export const LastName = trimTo(type.string.moreThanLength(0).atMostLength(LAST_NAME_MAX)).pipe(
	toTitleCase
);
export const Id = type('number >= 0');
const passwordMaxLength = 20;
const passwordMinLength = 8;
const allowedChars = /^[A-Za-z0-9!@$#()]+$/;

export const Password = type('string')
	.atLeastLength(passwordMinLength)
	.atMostLength(passwordMaxLength)
	.configure({
		problem: (ctx) => `Must be ${ctx.expected}`
	})
	.narrow((data, ctx) => {
		if (!allowedChars.test(data)) {
			return ctx.reject({
				problem: 'invalid characters. Only A–Z, a–z, 0–9, !@$#() are allowed.'
			});
		}
		if (!/[A-Z]/.test(data)) {
			return ctx.reject({
				problem: 'must contain at least one uppercase letter.'
			});
		}
		if (!/[a-z]/.test(data)) {
			return ctx.reject({
				problem: 'must contain at least one lowercase letter.'
			});
		}
		if (!/[0-9]/.test(data)) {
			return ctx.reject({
				problem: 'must contain at least one number.'
			});
		}
		if (!/[!@$#()]/.test(data)) {
			return ctx.reject({
				problem: 'must contain at least one special character (!@$#()).'
			});
		}
		return true;
	});

export const Duration = type('number').narrow((value, ctx) => {
	if (!Number.isInteger(value) || value <= 0) {
		return ctx.reject({
			problem: 'invalid minutes'
		});
	}
	return true;
});
