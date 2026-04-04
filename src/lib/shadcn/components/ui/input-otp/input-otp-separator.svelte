<script lang="ts">
  import type { WithElementRef } from '$lib/shadcn/utils.js';
  import type { HTMLAttributes } from 'svelte/elements';

  import { cn } from '$lib/shadcn/utils.js';
  import MinusIcon from '@lucide/svelte/icons/minus';

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
  bind:this={ref}
  class={cn("flex items-center [&_svg:not([class*='size-'])]:size-4", className)}
  data-slot="input-otp-separator"
  role="separator"
  {...restProps}
>
  {#if children}
    {@render children?.()}
  {:else}
    <MinusIcon />
  {/if}
</div>
