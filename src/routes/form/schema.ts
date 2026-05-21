import z from 'zod';

export const Schema = z.object({
  age: z.number().int(),
  date: z.string(),
  email: z.email()
});
