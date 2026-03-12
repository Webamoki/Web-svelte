<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import { cn } from '$lib/shadcn/utils.js';
  import { Select as SelectPrimitive } from 'bits-ui';

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: ComponentProps<typeof SelectPrimitive.GroupHeading> = $props();
</script>

<SelectPrimitive.GroupHeading
  class={cn('px-2 py-1.5 text-xs text-muted-foreground', className)}
  data-slot="select-group-heading"
  bind:ref
  {...restProps}
>
  {@render children?.()}
</SelectPrimitive.GroupHeading>
