<script lang="ts">
  import { toast } from 'svelte-sonner';

  import { testForm } from './action.remote.js';
</script>

<div class="mx-auto max-w-md space-y-4 p-8">
  <h1 class="text-2xl font-bold">Form test</h1>
  <form
    {...testForm.enhance(async ({ form, submit }) => {
      try {
        const submitted = await submit();
        const result = testForm.result;

        if (submitted) {
          form.reset();
        }
        if (result !== undefined) {
          toast.success(result.message);
        }
      } catch (e) {
        toast.error('An error occurred while submitting the form.');
        throw e;
      }
    })}
    class="flex flex-col gap-4"
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
  </form>
</div>
