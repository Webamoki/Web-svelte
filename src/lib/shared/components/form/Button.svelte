<script lang="ts">
  import type { ButtonProps } from '$lib/shadcn/components/ui/button/index.js';

  import { Button } from '$lib/shadcn/components/ui/button/index.js';
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
    ...restProps
  }: Props = $props();
</script>

<Button class={className} disabled={disabled || loading} {...restProps}>
  {#if loading}
    <Loader2Icon class="mr-2 animate-spin" />
    {loadingMessage}
  {:else}
    {@render children?.()}
  {/if}
</Button>
