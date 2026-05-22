<script generics="V,T extends Record<string, unknown>, U extends FormPath<T>, M" lang="ts">
  import type { Component } from 'svelte';
  import type { FormPath } from 'sveltekit-superforms';

  import { Input } from '$lib/shadcn/components/ui/input/index.js';
  import { cn } from '$lib/shadcn/utils.js';
  import IconInputWrapper from '$lib/shared/components/form-old/IconInputWrapper.svelte';

  import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

  interface Props extends FieldWrapperProps<T, U, M> {
    class?: string;
    icon?: Component;
    placeholder?: string;
    step?: HTMLInputElement['step'];
    value?: V;
  }
  let {
    class: className,
    icon,
    placeholder,
    step,
    value = $bindable(),
    ...fieldProps
  }: Props = $props();
</script>

<FieldWrapper {...fieldProps}>
  {#snippet formElem(props)}
    <IconInputWrapper {icon}>
      {#snippet children({ class: iconClass })}
        <Input
          class={cn(iconClass, className)}
          {placeholder}
          {step}
          type="number"
          bind:value
          {...props}
        />
      {/snippet}
    </IconInputWrapper>
  {/snippet}
</FieldWrapper>
