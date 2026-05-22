<script
  generics="
  Input extends RemoteFormInput,
  Data
  "
  lang="ts"
>
  import type { FormResult } from '$lib/shared/utils/form/result.js';
  import type { StandardSchemaV1 } from '@standard-schema/spec';
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';

  import { toast } from 'svelte-sonner';

  // Accepts both a plain remote form and a `.for(id)` instance (which omits `for`).
  type AnyRemoteForm =
    | Omit<RemoteForm<Input, FormResult<Data>>, 'for'>
    | RemoteForm<Input, FormResult<Data>>;

  interface Props {
    children?: Snippet;
    class?: string;
    defaults?: Partial<Input>;
    form: AnyRemoteForm;
    hidden?: Partial<Input>;
    onSuccess?: (data: Data) => void;
    reset?: boolean;
    schema: StandardSchemaV1<Input, unknown>;
  }

  let {
    children,
    class: className,
    defaults,
    form: remote,
    hidden,
    onSuccess,
    reset = true,
    schema
  }: Props = $props();
  // svelte-ignore state_referenced_locally
  if (defaults !== undefined) {
    remote.fields.set(defaults);
  }
</script>

<form
  class={className}
  oninput={() => remote.validate()}
  {...remote.preflight(schema).enhance(async ({ form: formElement, submit }) => {
    try {
      const submitted = await submit();
      const result = remote.result;

      if (submitted && reset) {
        formElement.reset();
      }

      if (result !== undefined) {
        const { data, message, type } = result;
        switch (type) {
          case 'error':
            if (message) toast.error(message);
            break;
          case 'ok':
            if (message) toast.success(message);
            onSuccess?.(data);
            break;
          case 'warning':
            if (message) toast.warning(message);
            break;
        }
      }
    } catch (e) {
      toast.error('An error occurred while submitting the form.');
      throw e;
    }
  })}
>
  {#if hidden}
    {#each Object.entries(hidden) as [name, value] (name)}
      <input {...remote.fields[name].as('hidden', value)} />
    {/each}
  {/if}
  {@render children?.()}
</form>
