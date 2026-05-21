import z from 'zod';

export const Schema = z.object({
  email: z.email(),
  name: z.string().min(1)
});
