<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  import { cn, type WithElementRef, type WithoutChildren } from '$lib/shadcn/utils.js';

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> = $props();
</script>

<div
  bind:this={ref}
  class={cn('animate-pulse rounded-md bg-muted', className)}
  data-slot="skeleton"
  {...restProps}
></div>
