import {
  formBoolean,
  formDate,
  formEmail,
  formFile,
  formHexColor,
  formNumber,
  formPin,
  formSelect,
  formText,
  formTime,
  nullable
} from '$lib/shared/utils/form/schema.js';
import z from 'zod';

export const SELECT_OPTIONS = ['apple', 'banana', 'cherry'] as const;

export const TextSchema = z.object({ text: formText });
export const EmailSchema = z.object({ email: formEmail });
export const PasswordSchema = z.object({ password: z.string().min(8) });
export const NumberSchema = z.object({ age: formNumber.pipe(z.number().int().min(0)) });
export const DateSchema = z.object({ date: formDate });
export const DateRangeSchema = z
  .object({ endDate: formDate, startDate: formDate })
  .refine((d) => d.endDate.compare(d.startDate) >= 0, {
    message: 'end date must be on or after start date',
    path: ['endDate']
  });
export const TimeSchema = z.object({ time: formTime });
export const FileSchema = z.object({ file: formFile });
export const CheckboxSchema = z.object({ agreed: formBoolean });
export const ColorSchema = z.object({ color: formHexColor });
export const MessageSchema = z.object({ message: formText });
export const PinSchema = z.object({ pin: formPin() });
export const SelectSchema = z.object({ select: formSelect(SELECT_OPTIONS) });

export const TextNullableSchema = z.object({ text: nullable(formText) });
export const EmailNullableSchema = z.object({ email: nullable(formEmail) });
export const NumberNullableSchema = z.object({
  age: nullable(formNumber.pipe(z.number().int().min(0)))
});
export const ColorNullableSchema = z.object({ color: nullable(formHexColor) });
export const PinNullableSchema = z.object({ pin: nullable(formPin()) });
export const SelectNullableSchema = z.object({ select: nullable(formSelect(SELECT_OPTIONS)) });

export const ShowcaseSchema = z.object({
  age: formNumber.pipe(z.number().int().min(0)),
  agreed: formBoolean,
  color: formHexColor,
  date: formDate,
  email: formEmail,
  message: formText,
  password: z.string().min(8),
  pin: formPin(),
  select: formSelect(SELECT_OPTIONS),
  text: formText,
  time: formTime
});
