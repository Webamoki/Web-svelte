<script generics="Input extends RemoteFormInput, I, V, K extends number | string" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Component, Snippet } from 'svelte';

  import ChevronDown from '@lucide/svelte/icons/chevron-down';

  import FieldLabel from '../FieldLabel.svelte';

  type LooseField = {
    as(type: 'select'): {
      'aria-invalid': 'false' | 'true' | boolean | undefined;
      name: string;
      readonly value: string;
    };
    issues(): Array<{ message: string; path: Array<number | string> }> | undefined;
  };

  interface Props {
    children?: Snippet;
    class?: string;
    form: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    getKey: (item: I) => K;
    getLabel: (item: I) => string;
    getValue: (item: I) => V;
    icon?: Component;
    items: readonly I[];
    name: keyof Input & string;
    nullable?: boolean;
    onchange?: (value: undefined | V) => void;
    placeholder: string;
    required?: boolean;
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
    placeholder,
    required
  }: Props = $props();

  const field = $derived((form.fields as Record<string, LooseField>)[name]);
  const attrs = $derived(field.as('select'));

  const keyToValue = $derived(
    new Map(items.map((item) => [String(getKey(item)), String(getValue(item))]))
  );
  const valueToItem = $derived(new Map(items.map((item) => [String(getValue(item)), item])));

  let selectedValue = $derived(attrs.value);

  function handleChange(e: Event) {
    const key = (e.currentTarget as HTMLSelectElement).value;
    const newValue = keyToValue.get(key) ?? '';
    selectedValue = newValue;
    const item = valueToItem.get(newValue);
    onchange?.(item === undefined ? undefined : getValue(item));
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
      aria-invalid={attrs['aria-invalid']}
      onchange={handleChange}
      {required}
      value={selectedValue}
    >
      <option disabled={!nullable} value="">{placeholder}</option>
      {#each items as item (getKey(item))}
        <option value={String(getKey(item))}>{getLabel(item)}</option>
      {/each}
    </select>
    <ChevronDown class="form-select-chevron" size={14} />
  </div>
  {#each field.issues() ?? [] as issue (`${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
