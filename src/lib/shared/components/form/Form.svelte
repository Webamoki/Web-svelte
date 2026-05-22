<script
  generics="
  Input extends RemoteFormInput,
  Data
  "
  lang="ts"
>
  import type { FormResult } from '$lib/shared/utils/form/result.js';
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
    onSuccess?: (data: Data) => void;
    remote: AnyRemoteForm;
  }

  let { children, class: className, onSuccess, remote }: Props = $props();
</script>

<form
  class={className}
  {...remote.enhance(async ({ form, submit }) => {
    try {
      const submitted = await submit();
      const result = remote.result;

      if (submitted) {
        form.reset();
      }
      if (result !== undefined) {
        if (result.ok) {
          const val = result.value;
          if (val.message) toast.success(val.message);
          onSuccess?.(val.data);
        } else {
          const err = result.error;
          toast.error(`${err.status}: ${err.message}`);
        }
      }
    } catch (e) {
      toast.error('An error occurred while submitting the form.');
      throw e;
    }
  })}
>
  {@render children?.()}
</form>
