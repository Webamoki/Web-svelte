import { form } from '$app/server';

import { Schema } from './schema.js';

export const testForm = form(Schema, async (data) => {
  console.log('Received data:', data);
  return { message: 'Submitted successfully' };
});
