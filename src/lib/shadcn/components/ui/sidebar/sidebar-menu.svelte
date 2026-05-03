<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  import { cn, type WithElementRef } from '$lib/shadcn/utils.js';

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLUListElement>, HTMLUListElement> = $props();
</script>

<ul
  bind:this={ref}
  class={cn('flex w-full min-w-0 flex-col gap-0', className)}
  data-sidebar="menu"
  data-slot="sidebar-menu"
  {...restProps}
>
  {@render children?.()}
</ul>
