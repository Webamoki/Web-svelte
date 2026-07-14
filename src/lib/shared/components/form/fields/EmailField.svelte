<script generics="Input extends RemoteFormInput, T = string" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type { ZodType } from 'zod/v4';

  import Field from '../Field.svelte';

  interface Props {
    autocapitalize?: HTMLInputAttributes['autocapitalize'];
    autocomplete?: HTMLInputAttributes['autocomplete'];
    children?: Snippet;
    class?: string;
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    name: keyof Input & string;
    onChange?: (value: T) => void;
    onInput?: (value: T) => void;
    onkeydown?: (event: KeyboardEvent & { currentTarget: HTMLInputElement }) => void;
    optional?: boolean;
    placeholder?: string;
    schema?: ZodType;
    spellcheck?: HTMLInputAttributes['spellcheck'];
    value?: T;
  }

  let {
    autocapitalize,
    autocomplete,
    children,
    class: className,
    form,
    name,
    onChange,
    onInput,
    onkeydown,
    optional,
    placeholder,
    schema,
    spellcheck,
    value = $bindable()
  }: Props = $props();
</script>

<Field
  {name}
  class={className}
  {autocapitalize}
  {autocomplete}
  {children}
  {form}
  {onChange}
  {onInput}
  {onkeydown}
  {optional}
  {placeholder}
  {schema}
  {spellcheck}
  type="email"
  bind:value
/>
