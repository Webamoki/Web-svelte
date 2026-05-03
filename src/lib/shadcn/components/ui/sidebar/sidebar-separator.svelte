<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import { Separator } from '$lib/shadcn/components/ui/separator/index.js';
  import { cn } from '$lib/shadcn/utils.js';

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: ComponentProps<typeof Separator> = $props();
</script>

<Separator
  class={cn('mx-2 w-auto bg-sidebar-border', className)}
  data-sidebar="separator"
  data-slot="sidebar-separator"
  bind:ref
  {...restProps}
/>
