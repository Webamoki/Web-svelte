<script lang="ts">
  import { cn } from '$lib/shadcn/utils.js';
  import { Select as SelectPrimitive } from 'bits-ui';

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: SelectPrimitive.GroupProps = $props();
</script>

<SelectPrimitive.Group
  class={cn('scroll-my-1 p-1', className)}
  data-slot="select-group"
  bind:ref
  {...restProps}
/>
