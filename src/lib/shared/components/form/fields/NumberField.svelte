<script generics="Input extends RemoteFormInput, T = string" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Component, Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type { ZodType } from 'zod/v4';

  import Field from '../Field.svelte';

  interface Props {
    autocomplete?: HTMLInputAttributes['autocomplete'];
    children?: Snippet;
    class?: string;
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    icon?: Component;
    /** Mobile keyboard hint — e.g. 'numeric' to avoid the native spinner while keeping the numeric pad. */
    inputmode?: HTMLInputAttributes['inputmode'];
    name: keyof Input & string;
    onChange?: (value: T) => void;
    onInput?: (value: T) => void;
    onkeydown?: HTMLInputAttributes['onkeydown'];
    optional?: boolean;
    placeholder?: string;
    schema?: ZodType;
    value?: T;
  }

  let {
    autocomplete,
    children,
    class: className,
    form,
    icon,
    inputmode,
    name,
    onChange,
    onInput,
    onkeydown,
    optional,
    placeholder,
    schema,
    value = $bindable()
  }: Props = $props();
</script>

<Field
  {name}
  class={className}
  {autocomplete}
  {children}
  {form}
  {icon}
  {inputmode}
  {onChange}
  {onInput}
  {onkeydown}
  {optional}
  {placeholder}
  {schema}
  type="number"
  bind:value
/>
