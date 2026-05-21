import { form } from '$app/server';
import { parseForm } from '$lib/shared/utils/form/form.server.js';
import z from 'zod';

import { Schema } from './schema.js';

export const testForm = form(Schema, async (data, issue) => {
  const parsedData = parseForm(data, issue, {
    date: z.coerce.date()
  });
  const age = parsedData.age;
  console.log(age + 1);
  const date = parsedData.date;
  console.log(date.toUTCString());
  return { message: 'Submitted successfully' };
});
