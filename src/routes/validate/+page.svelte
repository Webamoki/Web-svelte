<script lang="ts">
  import Button from '$lib/shared/components/form/Button.svelte';
  import TextField from '$lib/shared/components/form/fields/TextField.svelte';
  import { prepareEmptyForm } from '$lib/shared/utils/form/index.js';
  import { trimTo } from '$lib/shared/utils/zod.js';
  import { z } from 'zod/v4';

  const Schema = z.object({
    text: trimTo(z.string().min(1))
  });

  const { data, form } = prepareEmptyForm(Schema);

  function validate() {
    form.validateForm({ update: true });
  }
</script>

<div class="mx-auto max-w-md space-y-4 p-8">
  <h1 class="text-2xl font-bold">Validate</h1>
  <TextField name="text" {form} label="Text" bind:value={$data.text} />
  <Button onclick={validate}>Validate</Button>
</div>
