<script generics="Input extends RemoteFormInput, T = string" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Component, Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type { ZodType } from 'zod/v4';

  import UiInput from '$lib/shared/components/ui/Input.svelte';

  import { createFormView, createLocalTextView, type FieldView } from './field-view.svelte.js';
  import FieldLabel from './FieldLabel.svelte';

  interface Props {
    /** Native autocapitalize hint — passed through to the underlying <input>. */
    autocapitalize?: HTMLInputAttributes['autocapitalize'];
    /** Native autocomplete hint — passed through to the underlying <input>. */
    autocomplete?: HTMLInputAttributes['autocomplete'];
    children?: Snippet;
    /** Extra class(es) merged onto the underlying <input> (in addition to `form-input`). */
    class?: string;
    /** Passed through to the underlying <input>. */
    disabled?: HTMLInputAttributes['disabled'];
    /** When omitted the field is standalone — controlled via `bind:value`. */
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    icon?: Component;
    /** Mobile keyboard hint (e.g. 'numeric', 'decimal') — passed through to the underlying <input>. */
    inputmode?: HTMLInputAttributes['inputmode'];
    name: keyof Input & string;
    /** Standalone only — fired on the native `change` event. */
    onChange?: (value: T) => void;
    /** Standalone only — fired on every keystroke. */
    onInput?: (value: T) => void;
    /** Raw native keydown — passed through to the underlying <input> (e.g. Enter-to-submit). */
    onkeydown?: HTMLInputAttributes['onkeydown'];
    optional?: boolean;
    placeholder?: string;
    /** Standalone only — optional per-field validation. */
    schema?: ZodType;
    /** Native spellcheck hint — passed through to the underlying <input>. */
    spellcheck?: HTMLInputAttributes['spellcheck'];
    type: string;
    /** Standalone only — bound value when no `form` is provided. */
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

  // With a label the asterisk carries the required/optional cue. Without one,
  // required fields just show the placeholder; optional fields get an (Optional)
  // suffix so the cue reads naturally after the placeholder text.
  const displayPlaceholder = $derived(
    children || required ? placeholder : placeholder ? `${placeholder} (Optional)` : '(Optional)'
  );
</script>

<div class="form-field">
  {#if children}
    <FieldLabel for={view.attrs.name} {required}>{@render children()}</FieldLabel>
  {/if}
  <UiInput
    id={view.attrs.name}
    class={className}
    {autocapitalize}
    {autocomplete}
    {disabled}
    {icon}
    {inputmode}
    {onkeydown}
    placeholder={displayPlaceholder}
    {required}
    {spellcheck}
    {type}
    {...view.attrs}
  />
  {#each view.issues() as issue, i (i)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
