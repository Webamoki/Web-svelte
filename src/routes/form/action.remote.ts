import { form } from '$app/server';
import { parseForm } from '$lib/shared/utils/form/form.server.js';
import { stringToDate, stringToTime } from '$lib/shared/utils/form/parser.js';

import { Schema } from './schema.js';

export const testForm = form(Schema, async (data, issue) => {
  const parsedData = parseForm(data, issue, {
    date: stringToDate,
    time: stringToTime
  });
  const age = parsedData.age;
  console.log(age + 1);
  const date = parsedData.date;
  console.log(date.add({ days: 1 }));
  return { message: 'Submitted successfully' };
});
