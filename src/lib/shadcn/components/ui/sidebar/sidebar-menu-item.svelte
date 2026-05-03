<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  import { cn, type WithElementRef } from '$lib/shadcn/utils.js';

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLLIElement>, HTMLLIElement> = $props();
</script>

<li
  bind:this={ref}
  class={cn('group/menu-item relative', className)}
  data-sidebar="menu-item"
  data-slot="sidebar-menu-item"
  {...restProps}
>
  {@render children?.()}
</li>
