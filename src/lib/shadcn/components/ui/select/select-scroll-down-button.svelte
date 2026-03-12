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
  class={cn('flex cursor-default items-center justify-center py-1', className)}
  data-slot="select-scroll-down-button"
  bind:ref
  {...restProps}
>
  <ChevronDownIcon class="size-4" />
</SelectPrimitive.ScrollDownButton>
