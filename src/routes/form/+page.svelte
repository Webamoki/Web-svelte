<script lang="ts">
  import {
    DateField,
    EmailField,
    Form,
    NumberField,
    TimeField
  } from '$lib/shared/components/form/index.js';

  import { testForm } from './action.remote.js';
  import { Schema } from './schema.js';
</script>

<div class="mx-auto max-w-md space-y-4 p-8">
  <h1 class="text-2xl font-bold">Form test</h1>
  <Form
    class="flex flex-col gap-4"
    form={testForm}
    onSuccess={(data) => console.log('Client: Form Received:,', data.date.add({ days: 1 }))}
    schema={Schema}
  >
    <NumberField name="age" form={testForm}>Age</NumberField>
    <EmailField name="email" form={testForm}>Email</EmailField>
    <DateField name="date" form={testForm}>Date</DateField>
    <TimeField name="time" form={testForm}>Time</TimeField>
    <button>Submit</button>
  </Form>
</div>
