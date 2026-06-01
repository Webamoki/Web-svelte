<script generics="Input extends RemoteFormInput, T = string" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Component, Snippet } from 'svelte';
  import type { ZodType } from 'zod/v4';

  import UiInput from '$lib/shared/components/ui/Input.svelte';

  import { createFormView, createLocalTextView, type FieldView } from './field-view.svelte.js';
  import FieldLabel from './FieldLabel.svelte';

  interface Props {
    children?: Snippet;
    /** When omitted the field is standalone — controlled via `bind:value`. */
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    icon?: Component;
    name: keyof Input & string;
    /** Standalone only — fired on the native `change` event. */
    onChange?: (value: T) => void;
    /** Standalone only — fired on every keystroke. */
    onInput?: (value: T) => void;
    optional?: boolean;
    placeholder?: string;
    /** Standalone only — optional per-field validation. */
    schema?: ZodType;
    type: string;
    /** Standalone only — bound value when no `form` is provided. */
    value?: T;
  }

  let {
    children,
    form,
    icon,
    name,
    onChange,
    onInput,
    optional,
    placeholder,
    schema,
    type,
    value = $bindable()
  }: Props = $props();

  // `form`, `name` and `type` are fixed for a field instance; reading them once is intended.
  // `as()` is reached only via the `form` branch, so the standalone path never calls it.
  // svelte-ignore state_referenced_locally
  const view: FieldView = form
    ? createFormView(form, name, type)
    : createLocalTextView<T>({
        get: () => value as T,
        name,
        onChange,
        onInput,
        schema,
        write: (v) => (value = v)
      });

  const required = $derived(!optional);

  // With a label the asterisk carries the required/optional cue; without one the
  // placeholder does, so prefix it with (Required) / (Optional).
  const displayPlaceholder = $derived(
    children
      ? placeholder
      : `(${required ? 'Required' : 'Optional'})${placeholder != null ? ` ${placeholder}` : ''}`
  );
</script>

<div class="form-field">
  {#if children}
    <FieldLabel for={view.attrs.name} {required}>{@render children()}</FieldLabel>
  {/if}
  <UiInput
    id={view.attrs.name}
    {icon}
    placeholder={displayPlaceholder}
    {required}
    {type}
    {...view.attrs}
  />
  {#each view.issues() as issue, i (i)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
