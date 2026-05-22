<script lang="ts">
  import type { Component } from 'svelte';
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  import { Textarea } from '$lib/shadcn/components/ui/textarea/index.js';
  import { cn } from '$lib/shadcn/utils.js';
  import IconInputWrapper from '$lib/shared/components/form-old/IconInputWrapper.svelte';

  type Props = HTMLTextareaAttributes & {
    class?: string;
    defaultHeight?: number;
    icon?: Component;
    resize?: boolean;
    value?: string;
  };
  let {
    class: className,
    defaultHeight = 100,
    icon,
    resize = false,
    value = $bindable(),
    ...rest
  }: Props = $props();
</script>

<IconInputWrapper flex {icon} iconPosition="top">
  {#snippet children({ class: iconClass })}
    <Textarea
      style="height: {defaultHeight}px; min-height: {defaultHeight}px;"
      class={cn(resize ? 'resize-y' : 'resize-none', iconClass, className)}
      bind:value
      {...rest}
    />
  {/snippet}
</IconInputWrapper>
