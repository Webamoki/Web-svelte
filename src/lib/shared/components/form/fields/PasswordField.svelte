<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';

  import Field from '../Field.svelte';

  interface Props {
    children?: Snippet;
    form: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    name: keyof Input & string;
    placeholder?: string;
    required?: boolean;
  }

  let { children, form, name, placeholder, required }: Props = $props();
</script>

<Field {name} {children} {form} {placeholder} {required} type="password" />
