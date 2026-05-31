import { parseDate, parseTime } from '@internationalized/date';
import z from 'zod';

/**
 * Wraps any string-or-number schema so an empty input becomes `null`.
 * Usage: `nullable(formText.min(3))`, `nullable(formNumber)`, `nullable(formEmail)`.
 *
 * Handles `undefined` at runtime without exposing it in the type: `convert_formdata` emits
 * `undefined` for empty `n:`-prefixed (number) fields, which we treat as empty → null.
 */
export function nullable<T extends z.ZodType<unknown, number | string>>(schema: T) {
  return z
    .union([z.string(), z.number()])
    .transform((v): null | number | string => {
      // v may be undefined at runtime (empty n:-prefixed field) — treat as empty
      if (v == null || (typeof v === 'string' && v.trim() === '')) return null;
      return v;
    })
    .pipe(schema.nullable()) as z.ZodType<null | z.infer<T>, number | string>;
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

/**
 * Number field — parses string or number input to any finite number (unbounded).
 * Accepts numbers directly because `convert_formdata` parses `n:`-prefixed fields
 * via `parseFloat`, so preflight validation receives an already-parsed number.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formInt: z.ZodType<number, number | string> = z.any().transform((input: any, ctx) => {
  if (input === undefined || (typeof input === 'string' && input.trim() === '')) {
    ctx.issues.push({
      code: 'invalid_type',
      expected: 'number',
      input,
      message: 'number is required'
    });
    return z.NEVER;
  }
  const n = typeof input === 'number' ? input : Number(input);
  if (!Number.isFinite(n)) {
    ctx.issues.push({
      code: 'invalid_type',
      expected: 'number',
      input,
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
