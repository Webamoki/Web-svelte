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
    required?: boolean;
  }

  let { children, form, icon, name, placeholder, required }: Props = $props();
</script>

<Field {name} {form} {icon} {placeholder} {required} type="number">{@render children?.()}</Field>
