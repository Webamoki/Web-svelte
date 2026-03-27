<script generics="T extends Record<string, unknown>, U extends FormPath<T>, M" lang="ts">
  import type { Component } from 'svelte';
  import type { FormPath } from 'sveltekit-superforms';

  import { Input } from '$lib/shadcn/components/ui/input/index.js';
  import { cn } from '$lib/shadcn/utils.js';
  import IconInputWrapper from '$lib/shared/components/form/IconInputWrapper.svelte';

  import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

  interface Props extends FieldWrapperProps<T, U, M> {
    class?: string;
    icon?: Component;
    placeholder?: string;
    type?: HTMLInputElement['type'];
    value?: string;
  }
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
    <IconInputWrapper {icon}>
      {#snippet children({ class: iconClass })}
        <Input class={cn(iconClass, className)} {placeholder} {type} bind:value {...props} />
      {/snippet}
    </IconInputWrapper>
  {/snippet}
</FieldWrapper>
