<script generics="T extends Record<string, unknown>, U extends FormPath<T>, M" lang="ts">
  import type { Component } from 'svelte';
  import type { FormPath } from 'sveltekit-superforms';

  import TextArea from '$lib/shared/components/ui/TextArea.svelte';

  import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

  interface Props extends FieldWrapperProps<T, U, M> {
    class?: string;
    defaultHeight?: number;
    icon?: Component;
    placeholder?: string;
    resize?: boolean;
    value?: string;
  }
  let {
    class: className,
    defaultHeight = 100,
    icon,
    placeholder,
    resize = false,
    value = $bindable(),
    ...fieldProps
  }: Props = $props();
</script>

<FieldWrapper {...fieldProps}>
  {#snippet formElem(props)}
    <TextArea
      class={className}
      {defaultHeight}
      {icon}
      {placeholder}
      {resize}
      bind:value
      {...props}
    />
  {/snippet}
</FieldWrapper>
