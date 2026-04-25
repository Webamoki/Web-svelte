<script lang="ts">
  import Button from '$lib/shared/components/form/Button.svelte';
  import TextField from '$lib/shared/components/form/fields/TextField.svelte';
  import { trimTo, type } from '$lib/shared/utils/arktype.js';
  import { prepareEmptyForm } from '$lib/shared/utils/form/index.js';

  const Schema = type({
    text: trimTo(type.string.atLeastLength(1))
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
