<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Component, Snippet } from 'svelte';

  import Field from '../Field.svelte';

  interface Props {
    children?: Snippet;
    form: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    icon?: Component;
    name: keyof Input & string;
    placeholder?: string;
  }

  let { children, form, icon, name, placeholder }: Props = $props();
</script>

<Field {name} {form} {icon} {placeholder} type="number">{@render children?.()}</Field>
