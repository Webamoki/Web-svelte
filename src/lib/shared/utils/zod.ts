import { CalendarDate as calendarImport, Time as timeImport } from '@internationalized/date';
import { z } from 'zod/v4';

import { Days } from './datetime/index.js';

// Useful common types

// Positive integer for primary keys — mirrors auto-increment DB ids (>= 1)
export const IntegerId = z.int().min(1);

// Phone: allows "+", digits, and spaces only
export const Phone = z
  .string()
  .regex(/^[+0-9 ]+$/, 'invalid phone number. Only +, digits, and spaces are allowed.');

// Hex color: #RGB or #RRGGBB digits (no leading hash)
export const HexColor = z
  .string()
  .regex(/^[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/, 'invalid hex color value');

// Datetime types

export const Day = z.enum(Days);

export const Time = z.instanceof(timeImport, { error: 'invalid time' });

export const CalendarDate = z.instanceof(calendarImport, { error: 'invalid date' });

// Zod utilities

/** Type string which is trimmed before being validated against `typeTo`. */
export function trimTo<T extends z.ZodType<string, string>>(typeTo: T) {
  return z.string().trim().pipe(typeTo);
}
