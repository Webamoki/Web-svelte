<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  import { cn, type WithElementRef } from '$lib/shadcn/utils.js';

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {} = $props();
</script>

<div
  bind:this={ref}
  class={cn('px-1.5 py-1 text-xs text-muted-foreground', className)}
  data-slot="select-label"
  {...restProps}
>
  {@render children?.()}
</div>
