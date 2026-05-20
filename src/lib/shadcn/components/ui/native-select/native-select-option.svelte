<script lang="ts">
  import type { HTMLOptionAttributes } from 'svelte/elements';

  import { cn, type WithElementRef } from '$lib/shadcn/utils.js';

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLOptionAttributes> = $props();
</script>

<option
  bind:this={ref}
  class={cn('bg-[Canvas] text-[CanvasText]', className)}
  data-slot="native-select-option"
  {...restProps}
>
  {@render children?.()}
</option>
