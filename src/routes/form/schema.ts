import { stringDate, stringTime } from '$lib/shared/utils/form/parser.js';
import z from 'zod';

export const Schema = z.object({
  age: z.number().int(),
  date: stringDate,
  email: z.email(),
  time: stringTime
});
