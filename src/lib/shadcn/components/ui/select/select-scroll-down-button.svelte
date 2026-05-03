<script lang="ts">
  import { cn, type WithoutChildrenOrChild } from '$lib/shadcn/utils.js';
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import { Select as SelectPrimitive } from 'bits-ui';

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithoutChildrenOrChild<SelectPrimitive.ScrollDownButtonProps> = $props();
</script>

<SelectPrimitive.ScrollDownButton
  class={cn(
    "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
    className
  )}
  data-slot="select-scroll-down-button"
  bind:ref
  {...restProps}
>
  <ChevronDownIcon />
</SelectPrimitive.ScrollDownButton>
