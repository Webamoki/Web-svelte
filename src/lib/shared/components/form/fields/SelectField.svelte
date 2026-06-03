<script generics="Input extends RemoteFormInput, I, V, K extends number | string" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Component, Snippet } from 'svelte';
  import type { ZodType } from 'zod/v4';

  import ChevronDown from '@lucide/svelte/icons/chevron-down';

  import { createFormView, createLocalSelectView, type FieldView } from '../field-view.svelte.js';
  import FieldLabel from '../FieldLabel.svelte';

  interface Props {
    children?: Snippet;
    class?: string;
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    getKey: (item: I) => K;
    getLabel: (item: I) => string;
    getValue: (item: I) => V;
    icon?: Component;
    items: readonly I[];
    name: keyof Input & string;
    nullable?: boolean;
    onchange?: (value: undefined | V) => void;
    optional?: boolean;
    placeholder: string;
    schema?: ZodType;
    value?: undefined | V;
  }

  let {
    children,
    class: className,
    form,
    getKey,
    getLabel,
    getValue,
    icon: Icon,
    items,
    name,
    nullable = false,
    onchange,
    optional,
    placeholder,
    schema,
    value = $bindable()
  }: Props = $props();

  // `as('select')` is reached only via the `form` branch; standalone uses local state.
  // svelte-ignore state_referenced_locally
  const view: FieldView = form
    ? createFormView(form, name, 'select')
    : createLocalSelectView<undefined | V>({
        get: () => value,
        name,
        schema,
        write: (v) => (value = v)
      });

  const attrs = $derived(view.attrs);
  const required = $derived(!optional);

  // With a label the asterisk carries the required/optional cue. Without one,
  // required fields just show the placeholder; optional fields get an (Optional)
  // suffix so the cue reads naturally after the placeholder text.
  const displayPlaceholder = $derived(
    children || required || !placeholder ? placeholder : `${placeholder} (Optional)`
  );

  const keyToValue = $derived(
    new Map(items.map((item) => [String(getKey(item)), String(getValue(item))]))
  );
  const valueToItem = $derived(new Map(items.map((item) => [String(getValue(item)), item])));
  const valueToKey = $derived(
    new Map(items.map((item) => [String(getValue(item)), String(getKey(item))]))
  );

  // Form mode stores the submitted value string; standalone tracks the typed value,
  // so the selected option is resolved from its key.
  const selectedValue = $derived(
    form ? (attrs.value as string) : (valueToKey.get(String(value ?? '')) ?? '')
  );

  function handleChange(e: Event) {
    const key = (e.currentTarget as HTMLSelectElement).value;
    const newValue = keyToValue.get(key) ?? '';
    const item = valueToItem.get(newValue);
    const typedValue = item === undefined ? undefined : getValue(item);
    view.set(typedValue);
    onchange?.(typedValue);
  }
</script>

<div class="form-field">
  {#if children}
    <FieldLabel for={attrs.name} {required}>{@render children()}</FieldLabel>
  {/if}
  <div class={['form-select-wrapper', className].filter(Boolean).join(' ')}>
    {#if Icon}
      <div class="form-input-icon"><Icon /></div>
    {/if}
    <select
      id={attrs.name}
      name={attrs.name}
      class={[
        'form-input',
        'form-select',
        Icon && 'form-input--with-icon',
        !selectedValue && 'form-select--placeholder'
      ]
        .filter(Boolean)
        .join(' ')}
      aria-invalid={attrs['aria-invalid'] as 'false' | 'true' | boolean | undefined}
      onchange={handleChange}
      {required}
      value={selectedValue}
    >
      <option disabled={!nullable} value="">{displayPlaceholder}</option>
      {#each items as item (getKey(item))}
        <option value={String(getKey(item))}>{getLabel(item)}</option>
      {/each}
    </select>
    <ChevronDown class="form-select-chevron" size={14} />
  </div>
  {#each view.issues() as issue (`${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
