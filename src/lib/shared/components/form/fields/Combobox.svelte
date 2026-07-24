<script generics="Input extends RemoteFormInput, I, V, K extends number | string" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Component, Snippet } from 'svelte';
  import type { ZodType } from 'zod/v4';

  import Check from '@lucide/svelte/icons/check';
  import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
  import X from '@lucide/svelte/icons/x';
  import { Combobox as ComboboxPrimitive } from 'bits-ui';

  import { fuzzySearch, fuzzySearchHighlight } from '../../../utils/string.js';
  import { createFormView, createLocalSelectView, type FieldView } from '../field-view.svelte.js';
  import FieldLabel from '../FieldLabel.svelte';

  type BaseProps<Input extends RemoteFormInput, I, V, K extends number | string> = {
    children?: Snippet;
    class?: string;
    /** Overrides the "no results" row. Receives the current search query. */
    empty?: Snippet<[query: string]>;
    /** Rendered below the option list, inside the panel (e.g. an "add new…" action). */
    footer?: Snippet;
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    getKey: (item: I) => K;
    getLabel: (item: I) => string;
    getValue: (item: I) => V;
    /** Rendered above the option list, inside the panel (e.g. a hint line). */
    header?: Snippet;
    icon?: Component;
    items: readonly I[];
    name: keyof Input & string;
    /** Only meaningful for single-select — ignored when `multiple`. */
    nullable?: boolean;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
    optional?: boolean;
    placeholder: string;
    schema?: ZodType;
  };

  type Props<Input extends RemoteFormInput, I, V, K extends number | string> =
    | (BaseProps<Input, I, V, K> & {
        multiple: true;
        onchange?: (value: V[]) => void;
        value?: V[];
      })
    | (BaseProps<Input, I, V, K> & {
        multiple?: false;
        onchange?: (value: undefined | V) => void;
        value?: undefined | V;
      });

  let {
    children,
    class: className,
    empty,
    footer,
    form,
    getKey,
    getLabel,
    getValue,
    header,
    icon: Icon,
    items,
    multiple = false,
    name,
    nullable = false,
    onchange,
    onOpenChange,
    open = $bindable(false),
    optional,
    placeholder,
    schema,
    value = $bindable()
  }: Props<Input, I, V, K> = $props();

  // `as('select'|'select multiple')` is reached only via the `form` branch — SvelteKit's remote
  // forms natively support both (RemoteFormFieldType resolves 'select multiple' for a string[]
  // field), so no change to field-view.svelte.ts was needed for multi-select.
  // svelte-ignore state_referenced_locally
  const view: FieldView = form
    ? createFormView(form, name, multiple ? 'select multiple' : 'select')
    : createLocalSelectView<undefined | V | V[]>({
        get: () => value,
        name,
        schema,
        write: (v) => (value = v as typeof value)
      });

  const attrs = $derived(view.attrs);
  const required = $derived(!optional);
  const displayPlaceholder = $derived(
    children || required || !placeholder ? placeholder : `${placeholder} (Optional)`
  );

  let query = $state('');

  const keyToValue = $derived(
    new Map(items.map((item) => [String(getKey(item)), String(getValue(item))]))
  );
  const valueToItem = $derived(new Map(items.map((item) => [String(getValue(item)), item])));
  const valueToKey = $derived(
    new Map(items.map((item) => [String(getValue(item)), String(getKey(item))]))
  );
  const keyToLabel = $derived(new Map(items.map((item) => [String(getKey(item)), getLabel(item)])));

  const filteredItems = $derived(
    query.trim() === '' ? items : items.filter((item) => fuzzySearch(query, getLabel(item)))
  );

  // bits-ui `Combobox` uses this {value,label} list for typeahead matching, same as `Select`.
  const bitsItems = $derived(
    items.map((item) => ({ label: getLabel(item), value: String(getKey(item)) }))
  );

  // Form mode stores the submitted key(s); standalone tracks the typed value(s), resolved to
  // key(s) via valueToKey — same split SelectField uses, just branched on `multiple`.
  const selectedKey = $derived(
    !multiple ? (form ? (attrs.value as string) : (valueToKey.get(String(value ?? '')) ?? '')) : ''
  );
  const selectedKeys = $derived(
    multiple
      ? form
        ? ((attrs.value as string[] | undefined) ?? [])
        : ((value as undefined | V[]) ?? []).map((v) => valueToKey.get(String(v)) ?? '')
      : []
  );
  const selectedLabel = $derived(keyToLabel.get(selectedKey));
  const selectedChips = $derived(
    selectedKeys
      .map((key) => ({ key, label: keyToLabel.get(key) ?? key }))
      .filter((chip) => chip.label)
  );

  function handleSingleChange(key: string) {
    const newValue = keyToValue.get(key) ?? '';
    const item = valueToItem.get(newValue);
    const typedValue = item === undefined ? undefined : getValue(item);
    view.set(typedValue);
    (onchange as ((value: undefined | V) => void) | undefined)?.(typedValue);
  }

  function handleMultiChange(keys: string[]) {
    const typedValues = keys
      .map((key) => valueToItem.get(keyToValue.get(key) ?? ''))
      .filter((item): item is I => item !== undefined)
      .map((item) => getValue(item));
    view.set(typedValues);
    (onchange as ((value: V[]) => void) | undefined)?.(typedValues);
  }

  function removeChip(key: string) {
    handleMultiChange(selectedKeys.filter((k) => k !== key));
  }
</script>

{#snippet optionRow(item: I)}
  {@const label = getLabel(item)}
  {@const highlighted = query.trim() === '' ? null : fuzzySearchHighlight(query, label)}
  <span class="form-select-item-label">
    {#if highlighted}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html highlighted}
    {:else}
      {label}
    {/if}
  </span>
{/snippet}

<div class="form-field">
  {#if children}
    <FieldLabel for={attrs.name} {required}>{@render children()}</FieldLabel>
  {/if}

  {#if multiple}
    <ComboboxPrimitive.Root
      items={bitsItems}
      {onOpenChange}
      onValueChange={(keys) => handleMultiChange(keys)}
      {required}
      type="multiple"
      value={selectedKeys}
      bind:open
    >
      <div
        class={['form-input', 'form-select', 'form-combobox', 'form-combobox-multi', className]
          .filter(Boolean)
          .join(' ')}
      >
        {#if Icon}<Icon class="form-input-icon" />{/if}
        <div class="form-combobox-chips">
          {#each selectedChips as chip (chip.key)}
            <span class="form-combobox-chip">
              {chip.label}
              <button
                class="form-combobox-chip-remove"
                aria-label="Remove {chip.label}"
                onclick={() => removeChip(chip.key)}
                type="button"
              >
                <X size={11} />
              </button>
            </span>
          {/each}
          <ComboboxPrimitive.Input
            class="form-combobox-input"
            oninput={(e) => (query = e.currentTarget.value)}
            placeholder={selectedChips.length === 0 ? displayPlaceholder : ''}
          />
        </div>
        <ComboboxPrimitive.Trigger class="form-select-chevron-btn" aria-label="Toggle options">
          <ChevronsUpDown class="form-select-chevron" size={14} />
        </ComboboxPrimitive.Trigger>
      </div>
      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Content class="form-select-menu form-combobox-menu" sideOffset={4}>
          {#if header}<div class="form-combobox-header">{@render header()}</div>{/if}
          <ComboboxPrimitive.Viewport>
            {#each filteredItems as item (getKey(item))}
              <ComboboxPrimitive.Item
                class="form-select-item"
                label={getLabel(item)}
                value={String(getKey(item))}
              >
                {#snippet children({ selected })}
                  {@render optionRow(item)}
                  {#if selected}<Check class="form-select-item-check" size={14} />{/if}
                {/snippet}
              </ComboboxPrimitive.Item>
            {/each}
            {#if filteredItems.length === 0}
              {#if empty}
                {@render empty(query)}
              {:else}
                <div class="form-select-empty">No results for "{query}"</div>
              {/if}
            {/if}
          </ComboboxPrimitive.Viewport>
          {#if footer}<div class="form-combobox-footer">{@render footer()}</div>{/if}
        </ComboboxPrimitive.Content>
      </ComboboxPrimitive.Portal>
    </ComboboxPrimitive.Root>
    {#each selectedKeys as key (key)}
      <input name={attrs.name} type="hidden" value={keyToValue.get(key) ?? ''} />
    {/each}
  {:else}
    <ComboboxPrimitive.Root
      allowDeselect={nullable}
      inputValue={selectedLabel ?? ''}
      items={bitsItems}
      {onOpenChange}
      onValueChange={(key) => handleSingleChange(key)}
      {required}
      type="single"
      value={selectedKey}
      bind:open
    >
      <div
        class={['form-input', 'form-select', 'form-combobox', className].filter(Boolean).join(' ')}
      >
        {#if Icon}<Icon class="form-input-icon" />{/if}
        <ComboboxPrimitive.Input
          class="form-combobox-input"
          oninput={(e) => (query = e.currentTarget.value)}
          placeholder={selectedLabel ?? displayPlaceholder}
        />
        <ComboboxPrimitive.Trigger class="form-select-chevron-btn" aria-label="Toggle options">
          <ChevronsUpDown class="form-select-chevron" size={14} />
        </ComboboxPrimitive.Trigger>
      </div>
      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Content class="form-select-menu form-combobox-menu" sideOffset={4}>
          {#if header}<div class="form-combobox-header">{@render header()}</div>{/if}
          <ComboboxPrimitive.Viewport>
            {#each filteredItems as item (getKey(item))}
              <ComboboxPrimitive.Item
                class="form-select-item"
                label={getLabel(item)}
                value={String(getKey(item))}
              >
                {#snippet children({ selected })}
                  {@render optionRow(item)}
                  {#if selected}<Check class="form-select-item-check" size={14} />{/if}
                {/snippet}
              </ComboboxPrimitive.Item>
            {/each}
            {#if filteredItems.length === 0}
              {#if empty}
                {@render empty(query)}
              {:else}
                <div class="form-select-empty">No results for "{query}"</div>
              {/if}
            {/if}
          </ComboboxPrimitive.Viewport>
          {#if footer}<div class="form-combobox-footer">{@render footer()}</div>{/if}
        </ComboboxPrimitive.Content>
      </ComboboxPrimitive.Portal>
    </ComboboxPrimitive.Root>
    <input name={attrs.name} type="hidden" value={selectedKey} />
  {/if}

  {#each view.issues() as issue (`${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
