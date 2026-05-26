import { form } from '$app/server';
import { FormResult } from '$lib/shared/utils/form/result.js';

import { Schema } from './schema.js';

export const testForm = form(Schema, async (data) => {
  const age = data.age;
  console.log(age + 1);
  const date = data.date;
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
