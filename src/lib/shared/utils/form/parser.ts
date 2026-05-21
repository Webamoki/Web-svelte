import { parseDate, parseTime } from '@internationalized/date';
import z from 'zod';

/** String Date of ISO 8641 */
export const stringDate = z.string().refine((text) => {
  try {
    parseDate(text);
    return true;
  } catch {
    return false;
  }
}, 'Invalid date format. Expected YYYY-MM-DD');

/** ISO 8601 date string to CalendarDate */
export const stringToDate = z.string().transform((text, ctx) => {
  try {
    return parseDate(text);
  } catch {
    ctx.issues.push({
      code: 'invalid_format',
      format: 'date',
      input: text,
      message: 'Invalid date format, Expected YYYY-MM-DD'
    });
    return z.NEVER;
  }
});

/** String Time of ISO 8641 */
export const stringTime = z.string().refine((text) => {
  try {
    parseTime(text);
    return true;
  } catch {
    return false;
  }
}, 'Invalid time format. Expected HH:mm');

/** ISO 8601 time string to Time */
export const stringToTime = z.string().transform((text, ctx) => {
  try {
    return parseTime(text);
  } catch {
    ctx.issues.push({
      code: 'invalid_format',
      format: 'time',
      input: text,
      message: 'Invalid time format, Expected HH:mm'
    });
    return z.NEVER;
  }
});
