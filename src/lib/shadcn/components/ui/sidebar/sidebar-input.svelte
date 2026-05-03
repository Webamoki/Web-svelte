<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import { Input } from '$lib/shadcn/components/ui/input/index.js';
  import { cn } from '$lib/shadcn/utils.js';

  let {
    class: className,
    ref = $bindable(null),
    value = $bindable(''),
    ...restProps
  }: ComponentProps<typeof Input> = $props();
</script>

<Input
  class={cn('h-8 w-full bg-background shadow-none', className)}
  data-sidebar="input"
  data-slot="sidebar-input"
  bind:ref
  bind:value
  {...restProps}
/>
