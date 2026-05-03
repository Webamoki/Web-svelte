<script lang="ts">
  import { cn, type WithoutChild } from '$lib/shadcn/utils.js';
  import CheckIcon from '@lucide/svelte/icons/check';
  import { Select as SelectPrimitive } from 'bits-ui';

  let {
    children: childrenProp,
    class: className,
    label,
    ref = $bindable(null),
    value,
    ...restProps
  }: WithoutChild<SelectPrimitive.ItemProps> = $props();
</script>

<SelectPrimitive.Item
  class={cn(
    "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:bg-accent focus:text-accent-foreground focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
    className
  )}
  data-slot="select-item"
  {value}
  bind:ref
  {...restProps}
>
  {#snippet children({ highlighted, selected })}
    <span class="absolute end-2 flex size-3.5 items-center justify-center">
      {#if selected}
        <CheckIcon class="cn-select-item-indicator-icon" />
      {/if}
    </span>
    {#if childrenProp}
      {@render childrenProp({ highlighted, selected })}
    {:else}
      {label || value}
    {/if}
  {/snippet}
</SelectPrimitive.Item>
