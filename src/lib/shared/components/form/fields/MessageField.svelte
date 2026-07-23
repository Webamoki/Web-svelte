<script generics="Input extends RemoteFormInput, T = string" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Component, Snippet } from 'svelte';
  import type { HTMLTextareaAttributes } from 'svelte/elements';
  import type { ZodType } from 'zod/v4';

  import TextArea from '$lib/shared/components/ui/TextArea.svelte';

  import { createFormView, createLocalTextView, type FieldView } from '../field-view.svelte.js';
  import FieldLabel from '../FieldLabel.svelte';

  interface Props {
    /** Native autocomplete hint — passed through to the underlying <textarea>. */
    autocomplete?: HTMLTextareaAttributes['autocomplete'];
    children?: Snippet;
    class?: string;
    defaultHeight?: number;
    /** Passed through to the underlying <textarea>. */
    disabled?: HTMLTextareaAttributes['disabled'];
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    icon?: Component;
    name: keyof Input & string;
    onChange?: (value: T) => void;
    onInput?: (value: T) => void;
    /** Raw native keydown — passed through to the underlying <textarea> (e.g. Enter-to-submit). */
    onkeydown?: HTMLTextareaAttributes['onkeydown'];
    optional?: boolean;
    placeholder?: string;
    resize?: boolean;
    schema?: ZodType;
    /** Native spellcheck hint — passed through to the underlying <textarea>. */
    spellcheck?: HTMLTextareaAttributes['spellcheck'];
    value?: T;
  }

  let {
    autocomplete,
    children,
    class: className,
    defaultHeight = 100,
    disabled,
    form,
    icon,
    name,
    onChange,
    onInput,
    onkeydown,
    optional,
    placeholder,
    resize = false,
    schema,
    spellcheck,
    value = $bindable()
  }: Props = $props();

  // `as('text')` is reached only via the `form` branch; standalone uses local state.
  // svelte-ignore state_referenced_locally
  const view: FieldView = form
    ? createFormView(form, name, 'text')
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
  <TextArea
    id={view.attrs.name}
    class={className}
    {autocomplete}
    {defaultHeight}
    {disabled}
    {icon}
    {onkeydown}
    placeholder={displayPlaceholder}
    {required}
    {resize}
    {spellcheck}
    {...view.attrs}
  />
  {#each view.issues() as issue (`${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
