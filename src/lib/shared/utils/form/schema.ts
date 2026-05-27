import { parseDate, parseTime } from '@internationalized/date';
import z from 'zod';

/**
 * Wraps any string-input schema so an empty input becomes `null`.
 * Usage: `nullable(formText.min(3))`, `nullable(formNumber)`, `nullable(formEmail)`.
 */
export function nullable<T extends z.ZodType<unknown, string>>(schema: T) {
  return z
    .string()
    .transform((v) => (v.trim() === '' ? null : v))
    .pipe(schema.nullable()) as z.ZodType<null | z.infer<T>, string>;
}

/** Non-empty text field (trimmed, min 1 character) */
export const formText = z.string().trim().min(1, 'text cannot be empty');

/** Email field */
export const formEmail = z.email('invalid email address');

/** Boolean field — SvelteKit converts `b:`-prefixed checkbox inputs to `boolean`; defaults to `false` */
export const formBoolean = z
  .boolean()
  .optional()
  .transform((v) => v ?? false)
  .pipe(z.boolean());

/** Number field — parses string input to any finite number (unbounded) */
export const formInt = z.string().transform((text, ctx) => {
  const n = Number(text);
  if (text.trim() === '' || !Number.isFinite(n)) {
    ctx.issues.push({
      code: 'invalid_type',
      expected: 'number',
      input: text,
      message: 'invalid number'
    });
    return z.NEVER;
  }
  return n;
});

/** Number field — finite number bound to 0 or greater */
export const formNumber = formInt.pipe(z.number().min(0, 'must be 0 or greater'));

/** ISO 8601 date string to CalendarDate */
export const formDate = z.string().transform((text, ctx) => {
  try {
    return parseDate(text);
  } catch {
    ctx.issues.push({
      code: 'invalid_format',
      format: 'date',
      input: text,
      message: 'invalid date format, expected YYYY-MM-DD'
    });
    return z.NEVER;
  }
});

/** ISO 8601 time string to Time */
export const formTime = z.string().transform((text, ctx) => {
  try {
    return parseTime(text);
  } catch {
    ctx.issues.push({
      code: 'invalid_format',
      format: 'time',
      input: text,
      message: 'invalid time format, expected HH:mm'
    });
    return z.NEVER;
  }
});

/** File field — requires a non-empty file upload */
export const formFile = z.instanceof(File).refine((f) => f.size > 0, 'file is required');

/** 6-digit hex color string (without leading `#`) */
export const formHexColor = z
  .string({ error: 'please pick a color' })
  .regex(/^[0-9a-fA-F]{6}$/, 'invalid hex color, expected RRGGBB');

/** PIN field of a fixed length (default 6 digits) */
export function formPin(length = 6) {
  return z.string().regex(new RegExp(`^\\d{${length}}$`), `pin must be ${length} digits`);
}

/** Select field constrained to one of the provided options */
export function formSelect<T extends readonly [string, ...string[]]>(options: T) {
  return z.enum(options);
}
