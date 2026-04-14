<script
  generics="I,V, K extends number | string,T extends Record<string, unknown>, U extends FormPath<T>, M"
  lang="ts"
>
  import type { Component } from 'svelte';
  import type { FormPath } from 'sveltekit-superforms';

  import Select from '$lib/shared/components/ui/Select.svelte';

  import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

  interface Props extends FieldWrapperProps<T, U, M> {
    class?: string;
    getKey: (item: I) => K;
    getLabel: (item: I) => string;
    getValue: (item: I) => V;
    icon?: Component;
    items: readonly I[];
    onchange?: (value: undefined | V) => void;
    placeholder: string;
    value?: V;
  }
  let {
    class: className,
    getKey,
    getLabel,
    getValue,
    icon,
    items,
    onchange,
    placeholder,
    value = $bindable(undefined),
    ...fieldProps
  }: Props = $props();
</script>

<FieldWrapper {...fieldProps}>
  {#snippet formElem()}
    <Select
      class={className}
      {getKey}
      {getLabel}
      {getValue}
      {icon}
      {items}
      label={fieldProps.label}
      {onchange}
      {placeholder}
      bind:value
    />
  {/snippet}
</FieldWrapper>
