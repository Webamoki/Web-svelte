<script generics="Input extends RemoteFormInput, T = string" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Component, Snippet } from 'svelte';
  import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
  import type { ZodType } from 'zod/v4';

  import Field from '../Field.svelte';

  interface Props {
    autocapitalize?: HTMLInputAttributes['autocapitalize'];
    autocomplete?: HTMLInputAttributes['autocomplete'];
    children?: Snippet;
    class?: string;
    disabled?: HTMLInputAttributes['disabled'];
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    icon?: Component;
    inputmode?: HTMLInputAttributes['inputmode'];
    name: keyof Input & string;
    onChange?: (value: T) => void;
    onInput?: (value: T) => void;
    onkeydown?: HTMLInputAttributes['onkeydown'];
    optional?: boolean;
    placeholder?: string;
    schema?: ZodType;
    spellcheck?: HTMLInputAttributes['spellcheck'];
    /** Defaults to 'text' — override for a text-like native type (e.g. 'search', 'tel', 'url'). */
    type?: Extract<HTMLInputTypeAttribute, 'search' | 'tel' | 'text' | 'url'>;
    value?: T;
  }

  let {
    autocapitalize,
    autocomplete,
    children,
    class: className,
    disabled,
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
    spellcheck,
    type = 'text',
    value = $bindable()
  }: Props = $props();
</script>

<Field
  {name}
  class={className}
  {autocapitalize}
  {autocomplete}
  {children}
  {disabled}
  {form}
  {icon}
  {inputmode}
  {onChange}
  {onInput}
  {onkeydown}
  {optional}
  {placeholder}
  {schema}
  {spellcheck}
  {type}
  bind:value
/>
