import { formDate, formTime } from '$lib/shared/utils/form/schema.js';
import z from 'zod';

export const Schema = z.object({
  age: z.number().int(),
  date: formDate,
  email: z.email(),
  time: formTime
});
