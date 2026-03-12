<script lang="ts">
  import { cn, type WithoutChild } from '$lib/shadcn/utils.js';
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import { Select as SelectPrimitive } from 'bits-ui';

  let {
    children,
    class: className,
    ref = $bindable(null),
    size = 'default',
    ...restProps
  }: WithoutChild<SelectPrimitive.TriggerProps> & {
    size?: 'default' | 'sm';
  } = $props();
</script>

<SelectPrimitive.Trigger
  class={cn(
    'flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none select-none',
    'focus:border-transparent focus:ring-2 focus:ring-primary',
    'disabled:opacity-50',
    'aria-invalid:border-red-500 aria-invalid:focus:ring-red-300',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className
  )}
  data-size={size}
  data-slot="select-trigger"
  bind:ref
  {...restProps}
>
  {@render children?.()}
  <ChevronDownIcon class="size-4 opacity-50" />
</SelectPrimitive.Trigger>
