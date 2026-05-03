<script lang="ts">
  import { cn } from '$lib/shadcn/utils.js';
  import { Separator as SeparatorPrimitive } from 'bits-ui';

  let {
    class: className,
    'data-slot': dataSlot = 'separator',
    ref = $bindable(null),
    ...restProps
  }: SeparatorPrimitive.RootProps = $props();
</script>

<SeparatorPrimitive.Root
  class={cn(
    'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px',
    // this is different in shadcn/ui but self-stretch breaks things for us
    'data-[orientation=vertical]:h-full',
    className
  )}
  data-slot={dataSlot}
  bind:ref
  {...restProps}
/>
