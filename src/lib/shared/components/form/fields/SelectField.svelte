<script generics="Input extends RemoteFormInput, V extends number | string" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Component, Snippet } from 'svelte';
  import type { ZodType } from 'zod/v4';

  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import { Select } from 'bits-ui';
  import { setContext } from 'svelte';
  import { SvelteMap } from 'svelte/reactivity';

  import { createFormView, createLocalSelectView, type FieldView } from '../field-view.svelte.js';
  import FieldLabel from '../FieldLabel.svelte';
  import { SELECT_FIELD_CONTEXT, type SelectFieldContext } from './select-field-context.js';

  interface Props {
    /** The `<Option>` list — declarative, native `<select><option>`-style, in place of an
     *  `items`/`getKey`/`getLabel`/`getValue` array. */
    children: Snippet;
    class?: string;
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    icon?: Component;
    /** Field label text. Not `children` here — that's the option list. */
    label?: string;
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
    icon: Icon,
    label,
    name,
    nullable = false,
    onchange,
    optional,
    placeholder,
    schema,
    value = $bindable()
  }: Props = $props();

  const registry = new SvelteMap<string, { content: Snippet; label: string; value: unknown }>();
  const context: SelectFieldContext = {
    register: (key, entry) => registry.set(key, entry),
    unregister: (key) => registry.delete(key)
  };
  setContext(SELECT_FIELD_CONTEXT, context);

  // `as('select')` is reached only via the `form` branch; standalone uses local state — same
  // split `Combobox` uses.
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
  const displayPlaceholder = $derived(
    label || required || !placeholder ? placeholder : `${placeholder} (Optional)`
  );

  const selectedKey = $derived(form ? (attrs.value as string) : String(value ?? ''));
  const selectedEntry = $derived(registry.get(selectedKey));

  function handleChange(key: string) {
    const entry = registry.get(key);
    const typedValue = entry === undefined ? undefined : (entry.value as V);
    view.set(typedValue);
    onchange?.(typedValue);
  }
</script>

<div class="form-field">
  {#if label}
    <FieldLabel for={attrs.name} {required}>{label}</FieldLabel>
  {/if}
  <Select.Root
    allowDeselect={nullable}
    onValueChange={handleChange}
    {required}
    type="single"
    value={selectedKey}
  >
    <Select.Trigger
      id={attrs.name}
      class={[
        'form-input',
        'form-select',
        Icon && 'form-input--with-icon',
        !selectedKey && 'form-select--placeholder',
        className
      ]
        .filter(Boolean)
        .join(' ')}
      aria-invalid={attrs['aria-invalid'] as 'false' | 'true' | boolean | undefined}
    >
      {#if Icon}
        <div class="form-input-icon"><Icon /></div>
      {/if}
      <span class="form-select-value">
        {#if selectedEntry}
          {@render selectedEntry.content()}
        {:else}
          {displayPlaceholder}
        {/if}
      </span>
      <ChevronDown class="form-select-chevron" size={14} />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content class="form-select-menu" sideOffset={4}>
        <Select.Viewport>
          {@render children()}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
  <!-- bits-ui `Select` has no native form control; this hidden input carries the
       selected value into FormData exactly as the old native <select name> did. -->
  <input name={attrs.name} type="hidden" value={selectedKey} />
  {#each view.issues() as issue (`${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
