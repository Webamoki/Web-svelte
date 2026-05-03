<script lang="ts">
  import type { ButtonProps } from '$lib/shadcn/components/ui/button/index.js';

  import { Button } from '$lib/shadcn/components/ui/button/index.js';
  import { cn } from '$lib/shadcn/utils.js';
  import Loader2Icon from '@lucide/svelte/icons/loader-2';

  type Props = ButtonProps & {
    class?: string;
    loading?: boolean;
    loadingMessage?: string;
  };

  let {
    children,
    class: className,
    disabled,
    loading,
    loadingMessage = 'Please wait',
    variant,
    ...restProps
  }: Props = $props();
</script>

<Button
  class={cn(
    'cursor-pointer',
    variant === 'link' && 'text-blue-600 visited:text-purple-600',
    className
  )}
  disabled={disabled || loading}
  {variant}
  {...restProps}
>
  {#if loading}
    <Loader2Icon class="mr-2 animate-spin" />
    {loadingMessage}
  {:else}
    {@render children?.()}
  {/if}
</Button>
