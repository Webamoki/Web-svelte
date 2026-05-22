<script generics="I, V, K extends number | string" lang="ts">
  import type { ControlAttrs } from 'formsnap';
  import type { Component } from 'svelte';

  import {
    NativeSelect,
    NativeSelectOptGroup,
    NativeSelectOption
  } from '$lib/shadcn/components/ui/native-select/index.js';
  import { cn } from '$lib/shadcn/utils.js';
  import IconInputWrapper from '$lib/shared/components/form-old/IconInputWrapper.svelte';

  type Props = Partial<ControlAttrs> & {
    class?: string;
    getKey: (item: I) => K;
    getLabel: (item: I) => string;
    getValue: (item: I) => V;
    icon?: Component;
    items: readonly I[];
    label?: string;
    onchange?: (value: undefined | V) => void;
    placeholder: string;
    value?: V;
  };
  let {
    class: className,
    getKey: _getKey,
    getLabel,
    getValue,
    icon,
    items,
    label,
    onchange,
    placeholder,
    value = $bindable(undefined),
    ...rest
  }: Props = $props();

  let valueToItem: Map<V, I> = $derived(
    new Map(items.map((item) => [getValue(item), item] as const))
  );
  let keyToItem: Map<string, I> = $derived(
    new Map(items.map((item) => [getKey(item), item] as const))
  );

  function getKey(item: I) {
    return _getKey(item).toString();
  }

  function getKeyFromValue(): string {
    if (value === undefined) return '';
    const item = valueToItem.get(value);
    if (item === undefined) return '';
    return getKey(item);
  }

  function setValueFromKey(key: string) {
    const item = keyToItem.get(key);
    if (item === undefined) {
      value = undefined;
      onchange?.(undefined);
      return;
    }
    const newValue = getValue(item);
    value = newValue;
    onchange?.(newValue);
  }
</script>

<IconInputWrapper {icon}>
  {#snippet children({ class: iconClass })}
    <NativeSelect
      class={cn('w-full', className)}
      selectClass={iconClass}
      bind:value={getKeyFromValue, setValueFromKey}
      {...rest}
    >
      <NativeSelectOption disabled value="">{placeholder}</NativeSelectOption>
      {#if label}
        <NativeSelectOptGroup {label}>
          {#each items as item (getKey(item))}
            <NativeSelectOption value={getKey(item)}>{getLabel(item)}</NativeSelectOption>
          {/each}
        </NativeSelectOptGroup>
      {:else}
        {#each items as item (getKey(item))}
          <NativeSelectOption value={getKey(item)}>{getLabel(item)}</NativeSelectOption>
        {/each}
      {/if}
    </NativeSelect>
  {/snippet}
</IconInputWrapper>
