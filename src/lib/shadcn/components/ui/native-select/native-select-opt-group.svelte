<script lang="ts">
  import type { WithElementRef } from '$lib/shadcn/utils.js';
  import type { HTMLOptgroupAttributes } from 'svelte/elements';

  let {
    children,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLOptgroupAttributes> = $props();
</script>

<optgroup bind:this={ref} data-slot="native-select-opt-group" {...restProps}>
  {@render children?.()}
</optgroup>
