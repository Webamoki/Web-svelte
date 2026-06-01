<script generics="Input extends RemoteFormInput, T = string" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';
  import type { ZodType } from 'zod/v4';

  import Field from '../Field.svelte';

  interface Props {
    children?: Snippet;
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    name: keyof Input & string;
    onChange?: (value: T) => void;
    onInput?: (value: T) => void;
    optional?: boolean;
    schema?: ZodType;
    value?: T;
  }

  let {
    children,
    form,
    name,
    onChange,
    onInput,
    optional,
    schema,
    value = $bindable()
  }: Props = $props();
</script>

<Field {name} {children} {form} {onChange} {onInput} {optional} {schema} type="time" bind:value />
