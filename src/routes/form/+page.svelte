<script lang="ts">
  import Form from '$lib/shared/components/form/Form.svelte';

  import { testForm } from './action.remote.js';
</script>

<div class="mx-auto max-w-md space-y-4 p-8">
  <h1 class="text-2xl font-bold">Form test</h1>
  <Form
    class="flex flex-col gap-4"
    onSuccess={(data) => console.log('Client: Form Received:,', data.date.add({ days: 1 }))}
    remote={testForm}
  >
    <label>
      Age
      <input {...testForm.fields.age.as('number')} />
      {#each testForm.fields.age.issues() as issue (issue.path)}
        <p class="text-destructive">{issue.message}</p>
      {/each}
    </label>

    <label>
      Email
      <input {...testForm.fields.email.as('email')} />
      {#each testForm.fields.email.issues() as issue (issue.path)}
        <p class="text-destructive">{issue.message}</p>
      {/each}
    </label>

    <label>
      Date
      <input {...testForm.fields.date.as('text')} />
      {#each testForm.fields.date.issues() as issue (issue.path)}
        <p class="text-destructive">{issue.message}</p>
      {/each}
    </label>

    <label>
      Time
      <input {...testForm.fields.time.as('text')} />
      {#each testForm.fields.time.issues() as issue (issue.path)}
        <p class="text-destructive">{issue.message}</p>
      {/each}
    </label>

    <button>Submit</button>
  </Form>
</div>
