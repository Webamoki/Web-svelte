<script lang="ts">
  import { cn, type WithoutChildrenOrChild } from '$lib/shadcn/utils.js';
  import ChevronUpIcon from '@lucide/svelte/icons/chevron-up';
  import { Select as SelectPrimitive } from 'bits-ui';

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithoutChildrenOrChild<SelectPrimitive.ScrollUpButtonProps> = $props();
</script>

<SelectPrimitive.ScrollUpButton
  class={cn(
    "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
    className
  )}
  data-slot="select-scroll-up-button"
  bind:ref
  {...restProps}
>
  <ChevronUpIcon />
</SelectPrimitive.ScrollUpButton>
