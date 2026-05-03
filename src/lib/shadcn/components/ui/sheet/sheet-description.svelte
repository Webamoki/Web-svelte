<script lang="ts">
  import { cn } from '$lib/shadcn/utils.js';
  import { Dialog as SheetPrimitive } from 'bits-ui';

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: SheetPrimitive.DescriptionProps = $props();
</script>

<SheetPrimitive.Description
  class={cn('text-sm text-muted-foreground', className)}
  data-slot="sheet-description"
  bind:ref
  {...restProps}
/>
