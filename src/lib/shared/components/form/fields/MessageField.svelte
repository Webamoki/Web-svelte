<script generics="Input extends RemoteFormInput, T = string" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Component, Snippet } from 'svelte';
  import type { ZodType } from 'zod/v4';

  import TextArea from '$lib/shared/components/ui/TextArea.svelte';

  import { createFormView, createLocalTextView, type FieldView } from '../field-view.svelte.js';
  import FieldLabel from '../FieldLabel.svelte';

  interface Props {
    children?: Snippet;
    class?: string;
    defaultHeight?: number;
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    icon?: Component;
    name: keyof Input & string;
    onChange?: (value: T) => void;
    onInput?: (value: T) => void;
    optional?: boolean;
    placeholder?: string;
    resize?: boolean;
    schema?: ZodType;
    value?: T;
  }

  let {
    children,
    class: className,
    defaultHeight = 100,
    form,
    icon,
    name,
    onChange,
    onInput,
    optional,
    placeholder,
    resize = false,
    schema,
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
    {defaultHeight}
    {icon}
    placeholder={displayPlaceholder}
    {required}
    {resize}
    {...view.attrs}
  />
  {#each view.issues() as issue (`${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
