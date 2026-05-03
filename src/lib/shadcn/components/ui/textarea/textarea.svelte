<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  import { cn, type WithElementRef, type WithoutChildren } from '$lib/shadcn/utils.js';

  let {
    class: className,
    'data-slot': dataSlot = 'textarea',
    ref = $bindable(null),
    value = $bindable(),
    ...restProps
  }: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props();
</script>

<textarea
  bind:this={ref}
  class={cn(
    'flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
    className
  )}
  data-slot={dataSlot}
  bind:value
  {...restProps}
></textarea>
