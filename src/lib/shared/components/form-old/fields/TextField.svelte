<script generics="T extends Record<string, unknown>, U extends FormPath<T>, M" lang="ts">
  import type { Component } from 'svelte';
  import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
  import type { FormPath } from 'sveltekit-superforms';

  import Input from '$lib/shared/components/ui/Input.svelte';

  import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

  type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

  type Props = FieldWrapperProps<T, U, M> &
    Omit<HTMLInputAttributes, 'form' | 'type'> & {
      class?: string;
      icon?: Component;
      placeholder?: string;
      type?: InputType;
      value?: string;
    };
  let {
    class: className,
    icon,
    placeholder,
    type = 'text',
    value = $bindable(),
    ...fieldProps
  }: Props = $props();
</script>

<FieldWrapper {...fieldProps}>
  {#snippet formElem(props)}
    <Input class={className} {icon} {placeholder} {type} bind:value {...props} />
  {/snippet}
</FieldWrapper>
