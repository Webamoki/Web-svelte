<script
  generics="I,V, K extends number | string,T extends Record<string, unknown>, U extends FormPath<T>, M"
  lang="ts"
>
  import type { Component } from 'svelte';
  import type { FormPath } from 'sveltekit-superforms';

  import {
    NativeSelect,
    NativeSelectOptGroup,
    NativeSelectOption
  } from '$lib/shadcn/components/ui/native-select/index.js';
  import { cn } from '$lib/shadcn/utils.js';
  import IconInputWrapper from '$lib/shared/components/form/IconInputWrapper.svelte';

  import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

  interface Props extends FieldWrapperProps<T, U, M> {
    class?: string;
    getKey: (item: I) => K;
    getLabel: (item: I) => string;
    getValue: (item: I) => V;
    icon?: Component;
    items: readonly I[];
    onchange?: (value: V[]) => void;
    placeholder?: string;
    values?: V[];
  }
  let {
    class: className,
    getKey: _getKey,
    getLabel,
    getValue,
    icon,
    items,
    onchange,
    values = $bindable([]),
    ...fieldProps
  }: Props = $props();
  // Items property shouldn't be updated, ignore warning
  // svelte-ignore state_referenced_locally
  let valueToItem: Map<V, I> = new Map(items.map((item) => [getValue(item), item] as const));
  // svelte-ignore state_referenced_locally
  let keyToItem: Map<string, I> = new Map(items.map((item) => [getKey(item), item] as const));

  // Enforce string key function
  function getKey(item: I) {
    const key = _getKey(item);
    return key.toString();
  }

  function getKeysFromValues(): string[] {
    return values
      .map((value) => valueToItem.get(value))
      .filter((item): item is I => item !== undefined)
      .map((item) => getKey(item));
  }

  function setValuesFromKeys(keys: string[]) {
    const newValues: V[] = keys
      .map((key) => keyToItem.get(key))
      .filter((item): item is I => item !== undefined)
      .map((item) => getValue(item));
    values = newValues;
    onchange?.(newValues);
  }
</script>

<FieldWrapper {...fieldProps}>
  {#snippet formElem(props)}
    <IconInputWrapper {icon}>
      {#snippet children({ class: iconClass })}
        <NativeSelect
          class={cn('w-full', className)}
          multiple
          selectClass={cn('h-auto', iconClass)}
          bind:value={getKeysFromValues, setValuesFromKeys}
          {...props}
        >
          <NativeSelectOptGroup label={fieldProps.label}>
            {#each items as item (getKey(item))}
              <NativeSelectOption value={getKey(item)}>{getLabel(item)}</NativeSelectOption>
            {/each}
          </NativeSelectOptGroup>
        </NativeSelect>
      {/snippet}
    </IconInputWrapper>
  {/snippet}
</FieldWrapper>
