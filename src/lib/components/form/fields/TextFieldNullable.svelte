<script generics="T extends Record<string, unknown>, U extends FormPath<T>, M" lang="ts">
  import type { Component } from 'svelte';
  import type { FormPath } from 'sveltekit-superforms';

  import { Input } from '$lib/shadcn/components/ui/input/index.js';
  import { cn } from '$lib/shadcn/utils.js';

  import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

  interface Props extends FieldWrapperProps<T, U, M> {
    class?: string;
    icon?: Component;
    placeholder?: string;
    type?: HTMLInputElement['type'];
    value?: null | string;
  }
  let {
    class: className,
    icon,
    placeholder,
    type = 'text',
    value = $bindable(),
    ...fieldProps
  }: Props = $props();

  function get() {
    if (!value) return '';
    return value;
  }
  function set(raw: string | undefined) {
    value = raw || null;
  }
</script>

<FieldWrapper {...fieldProps}>
  {#snippet formElem(props)}
    {#if icon}
      {@const Icon = icon}
      <div class="relative">
        <div class="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-500">
          <Icon class="size-5" />
        </div>
        <Input
          class={cn('pl-12', className)}
          {placeholder}
          {type}
          bind:value={get, set}
          {...props}
        />
      </div>
    {:else}
      <Input class={className} {placeholder} {type} bind:value={get, set} {...props} />
    {/if}
  {/snippet}
</FieldWrapper>
