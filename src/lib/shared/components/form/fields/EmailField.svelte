<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';

  import Field from '../Field.svelte';

  interface Props {
    children?: Snippet;
    form: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    name: keyof Input & string;
    optional?: boolean;
    placeholder?: string;
  }

  let { children, form, name, optional, placeholder }: Props = $props();
</script>

<Field {name} {children} {form} {optional} {placeholder} type="email" />
