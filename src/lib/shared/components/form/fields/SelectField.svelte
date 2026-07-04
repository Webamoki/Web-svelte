<script generics="Input extends RemoteFormInput, I, V, K extends number | string" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Component, Snippet } from 'svelte';
  import type { ZodType } from 'zod/v4';

  import Check from '@lucide/svelte/icons/check';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import { Select } from 'bits-ui';

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
  const keyToLabel = $derived(new Map(items.map((item) => [String(getKey(item)), getLabel(item)])));

  // bits-ui `Select` uses this {value,label} list for typeahead + autofill matching.
  const bitsItems = $derived(
    items.map((item) => ({ label: getLabel(item), value: String(getKey(item)) }))
  );

  // Form mode stores the submitted value string; standalone tracks the typed value,
  // so the selected option is resolved from its key. This string is both the value
  // fed to bits-ui `Select` (its item values are keyed by `getKey`) and the value
  // carried by the hidden input below into the form's FormData.
  const selectedValue = $derived(
    form ? (attrs.value as string) : (valueToKey.get(String(value ?? '')) ?? '')
  );
  const selectedLabel = $derived(keyToLabel.get(selectedValue));

  function handleChange(key: string) {
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
  <Select.Root
    allowDeselect={nullable}
    items={bitsItems}
    onValueChange={handleChange}
    {required}
    type="single"
    value={selectedValue}
  >
    <Select.Trigger
      id={attrs.name}
      class={[
        'form-input',
        'form-select',
        Icon && 'form-input--with-icon',
        !selectedValue && 'form-select--placeholder',
        className
      ]
        .filter(Boolean)
        .join(' ')}
      aria-invalid={attrs['aria-invalid'] as 'false' | 'true' | boolean | undefined}
    >
      {#if Icon}
        <div class="form-input-icon"><Icon /></div>
      {/if}
      <span class="form-select-value">{selectedLabel ?? displayPlaceholder}</span>
      <ChevronDown class="form-select-chevron" size={14} />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content class="form-select-menu" sideOffset={4}>
        <Select.Viewport>
          {#each items as item (getKey(item))}
            <Select.Item
              class="form-select-item"
              label={getLabel(item)}
              value={String(getKey(item))}
            >
              {#snippet children({ selected })}
                <span class="form-select-item-label">{getLabel(item)}</span>
                {#if selected}
                  <Check class="form-select-item-check" size={14} />
                {/if}
              {/snippet}
            </Select.Item>
          {/each}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
  <!-- bits-ui `Select` has no native form control; this hidden input carries the
       selected value into FormData exactly as the old native <select name> did. -->
  <input name={attrs.name} type="hidden" value={selectedValue} />
  {#each view.issues() as issue (`${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
