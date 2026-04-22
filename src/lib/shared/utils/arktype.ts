import { CalendarDate as calendarImport, Time as timeImport } from '@internationalized/date';
import { scope, type Type } from 'arktype';

import { Days } from './datetime/index.js';

/** Global scope for jitless config: required for cloudflare workers
 *   Use this instead of global arktype
 */
export const arktype = scope({}, { jitless: true });
export const type = arktype.type;

// Useful common types

export const IntegerId = type('number.integer >= 0');

// Phone arktype: allows "+", digits, and spaces only
export const Phone = type('string').narrow((value, ctx) => {
  if (!/^[+0-9 ]+$/.test(value)) {
    return ctx.reject({
      problem: 'invalid phone number. Only +, digits, and spaces are allowed.'
    });
  }
  return true;
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

// Datetime types

export const Day = type.enumerated(...Days);

export const Time = type.instanceOf(timeImport).configure({
  problem: () => 'invalid time'
});

export const CalendarDate = type.instanceOf(calendarImport).configure({
  problem: () => 'invalid date'
});

// Arktype utilities

/** Type string which is trimmed before narrowing the type checking */
export function trimTo(typeTo: Type<string>) {
  return type('string.trim').to(typeTo);
}
