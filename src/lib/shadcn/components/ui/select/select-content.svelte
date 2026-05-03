<script lang="ts">
  import type { WithoutChildrenOrChild } from '$lib/shadcn/utils.js';
  import type { ComponentProps } from 'svelte';

  import { cn, type WithoutChild } from '$lib/shadcn/utils.js';
  import { Select as SelectPrimitive } from 'bits-ui';

  import SelectPortal from './select-portal.svelte';
  import SelectScrollDownButton from './select-scroll-down-button.svelte';
  import SelectScrollUpButton from './select-scroll-up-button.svelte';

  let {
    children,
    class: className,
    portalProps,
    preventScroll = true,
    ref = $bindable(null),
    sideOffset = 4,
    ...restProps
  }: WithoutChild<SelectPrimitive.ContentProps> & {
    portalProps?: WithoutChildrenOrChild<ComponentProps<typeof SelectPortal>>;
  } = $props();
</script>

<SelectPortal {...portalProps}>
  <SelectPrimitive.Content
    class={cn(
      'relative isolate z-50 min-w-36 overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
      className
    )}
    data-slot="select-content"
    {preventScroll}
    {sideOffset}
    bind:ref
    {...restProps}
  >
    <SelectScrollUpButton />
    <SelectPrimitive.Viewport
      class={cn(
        'h-(--bits-select-anchor-height) w-full min-w-(--bits-select-anchor-width) scroll-my-1'
      )}
    >
      {@render children?.()}
    </SelectPrimitive.Viewport>
    <SelectScrollDownButton />
  </SelectPrimitive.Content>
</SelectPortal>
