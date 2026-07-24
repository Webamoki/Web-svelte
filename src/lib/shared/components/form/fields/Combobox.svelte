<script generics="Input extends RemoteFormInput, V extends number | string" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Component, Snippet } from 'svelte';
  import type { ZodType } from 'zod/v4';

  import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
  import X from '@lucide/svelte/icons/x';
  import { Combobox as ComboboxPrimitive } from 'bits-ui';
  import { setContext } from 'svelte';
  import { SvelteMap } from 'svelte/reactivity';

  import { fuzzySearch } from '../../../utils/string.js';
  import { createFormView, createLocalSelectView, type FieldView } from '../field-view.svelte.js';
  import FieldLabel from '../FieldLabel.svelte';
  import {
    SELECT_FIELD_CONTEXT,
    type SelectFieldContext,
    type SelectFieldEntry
  } from './select-field-context.js';

  type BaseProps<Input extends RemoteFormInput> = {
    /** The `<Option>` list — declarative, native `<select><option>`-style. */
    children: Snippet;
    class?: string;
    /** Overrides the "no results" row. Receives the current search query. */
    empty?: Snippet<[query: string]>;
    /** Rendered below the option list, inside the panel (e.g. an "add new…" action). */
    footer?: Snippet;
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    /** Rendered above the option list, inside the panel (e.g. a hint line). */
    header?: Snippet;
    icon?: Component;
    /** Field label text. Not `children` here — that's the option list. */
    label?: string;
    name: keyof Input & string;
    /** Only meaningful for single-select — ignored when `multiple`. */
    nullable?: boolean;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
    optional?: boolean;
    placeholder: string;
    schema?: ZodType;
  };

  type Props<Input extends RemoteFormInput, V> =
    | (BaseProps<Input> & {
        multiple: true;
        onchange?: (value: V[]) => void;
        value?: V[];
      })
    | (BaseProps<Input> & {
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
    header,
    icon: Icon,
    label,
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
  }: Props<Input, V> = $props();

  const registry = new SvelteMap<string, SelectFieldEntry>();
  let query = $state('');
  const context: SelectFieldContext = {
    getQuery: () => query,
    register: (key, entry) => registry.set(key, entry),
    unregister: (key) => registry.delete(key)
  };
  setContext(SELECT_FIELD_CONTEXT, context);

  let boxEl = $state<HTMLDivElement | undefined>();

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
    label || required || !placeholder ? placeholder : `${placeholder} (Optional)`
  );

  // bits-ui `Combobox` uses this {value,label} list for typeahead matching, same as `Select`.
  const bitsItems = $derived(
    [...registry.entries()].map(([key, entry]) => ({ label: entry.label, value: key }))
  );

  const hasVisibleOptions = $derived(
    [...registry.values()].some((entry) => query.trim() === '' || fuzzySearch(query, entry.label))
  );

  // Form mode stores the submitted key(s); standalone tracks the typed value(s), keyed the same
  // way `<Option>` derives its own key (`String(value)`) — same split `SelectField` uses, just
  // branched on `multiple`.
  const selectedKey = $derived(
    !multiple ? (form ? (attrs.value as string) : String(value ?? '')) : ''
  );
  const selectedKeys = $derived(
    multiple
      ? form
        ? ((attrs.value as string[] | undefined) ?? [])
        : ((value as undefined | V[]) ?? []).map((v) => String(v))
      : []
  );
  const selectedLabel = $derived(registry.get(selectedKey)?.label);
  const selectedChips = $derived(
    selectedKeys
      .map((key) => ({ key, label: registry.get(key)?.label ?? key }))
      .filter((chip) => chip.label)
  );

  function handleSingleChange(key: string) {
    const typedValue = registry.get(key)?.value as undefined | V;
    view.set(typedValue);
    (onchange as ((value: undefined | V) => void) | undefined)?.(typedValue);
  }

  function handleMultiChange(keys: string[]) {
    const typedValues = keys
      .map((key) => registry.get(key)?.value)
      .filter((v): v is V => v !== undefined);
    view.set(typedValues);
    (onchange as ((value: V[]) => void) | undefined)?.(typedValues);
  }

  function removeChip(key: string) {
    handleMultiChange(selectedKeys.filter((k) => k !== key));
  }
</script>

<div class="form-field">
  {#if label}
    <FieldLabel for={attrs.name} {required}>{label}</FieldLabel>
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
        bind:this={boxEl}
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
        <ComboboxPrimitive.Content
          class="form-select-menu form-combobox-menu"
          customAnchor={boxEl}
          forceMount
          sideOffset={4}
        >
          {#if header}<div class="form-combobox-header">{@render header()}</div>{/if}
          <ComboboxPrimitive.Viewport>
            {@render children()}
            {#if !hasVisibleOptions}
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
      <input name={attrs.name} type="hidden" value={key} />
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
        bind:this={boxEl}
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
        <ComboboxPrimitive.Content
          class="form-select-menu form-combobox-menu"
          customAnchor={boxEl}
          forceMount
          sideOffset={4}
        >
          {#if header}<div class="form-combobox-header">{@render header()}</div>{/if}
          <ComboboxPrimitive.Viewport>
            {@render children()}
            {#if !hasVisibleOptions}
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
