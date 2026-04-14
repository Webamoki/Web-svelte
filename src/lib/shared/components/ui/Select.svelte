<script generics="I, V, K extends number | string" lang="ts">
  import type { Component } from 'svelte';

  import {
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    Select as ShadSelect
  } from '$lib/shadcn/components/ui/select/index.js';
  import { cn } from '$lib/shadcn/utils.js';
  import IconInputWrapper from '$lib/shared/components/form/IconInputWrapper.svelte';

  interface Props {
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
  }
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
    value = $bindable(undefined)
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  let valueToItem: Map<V, I> = new Map(items.map((item) => [getValue(item), item] as const));
  // svelte-ignore state_referenced_locally
  let keyToItem: Map<string, I> = new Map(items.map((item) => [getKey(item), item] as const));

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
    if (item === undefined) return;
    const newValue = getValue(item);
    value = newValue;
    onchange?.(newValue);
  }
</script>

<ShadSelect type="single" bind:value={getKeyFromValue, setValueFromKey}>
  <IconInputWrapper {icon}>
    {#snippet children({ class: iconClass })}
      <SelectTrigger class={cn('w-full cursor-pointer truncate', iconClass, className)}>
        <span class="block truncate">
          {value ? getLabel(valueToItem.get(value)!) : placeholder}
        </span>
      </SelectTrigger>
    {/snippet}
  </IconInputWrapper>
  <SelectContent>
    <SelectGroup>
      {#if label}
        <SelectLabel>{label}</SelectLabel>
      {/if}
      {#each items as item (getKey(item))}
        <SelectItem class="cursor-pointer" label={getLabel(item)} value={getKey(item)} />
      {/each}
    </SelectGroup>
  </SelectContent>
</ShadSelect>
