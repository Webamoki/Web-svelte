import { form } from '$app/server';
import { parseForm } from '$lib/shared/utils/form/form.server.js';
import { stringToDate, stringToTime } from '$lib/shared/utils/form/parser.js';
import { FormResult } from '$lib/shared/utils/form/result.js';

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

  // Return just a message to toast
  // return FormResult.ok('Success');

  // Or return a message and some data
  return FormResult.okData({
    data: {
      date
    },
    message: 'Success'
  });
});
