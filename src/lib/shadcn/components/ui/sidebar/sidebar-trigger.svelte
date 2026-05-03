<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import { Button } from '$lib/shadcn/components/ui/button/index.js';
  import { cn } from '$lib/shadcn/utils.js';
  import PanelLeftIcon from '@lucide/svelte/icons/panel-left';

  import { useSidebar } from './context.svelte.js';

  let {
    class: className,
    onclick,
    ref = $bindable(null),
    ...restProps
  }: ComponentProps<typeof Button> & {
    onclick?: (e: MouseEvent) => void;
  } = $props();

  const sidebar = useSidebar();
</script>

<Button
  class={cn('cn-sidebar-trigger', className)}
  data-sidebar="trigger"
  data-slot="sidebar-trigger"
  onclick={(e) => {
    onclick?.(e);
    sidebar.toggle();
  }}
  size="icon-sm"
  type="button"
  variant="ghost"
  bind:ref
  {...restProps}
>
  <PanelLeftIcon />
  <span class="sr-only">Toggle Sidebar</span>
</Button>
