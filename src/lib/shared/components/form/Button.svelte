<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  import Loader2 from '@lucide/svelte/icons/loader-2';
  import { Button as ButtonPrimitive } from 'bits-ui';

  type Variant = 'default' | 'destructive' | 'ghost' | 'ghost-destructive' | (string & {});

  interface Props extends Omit<HTMLButtonAttributes, 'form' | 'type'> {
    children?: Snippet;
    class?: string;
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    href?: string;
    loading?: boolean;
    loadingMessage?: string;
    reset?: boolean;
    variant?: Variant;
  }

  let {
    children,
    class: className = '',
    disabled,
    form,
    href,
    loading = false,
    loadingMessage,
    reset = false,
    variant = 'default',
    ...restProps
  }: Props = $props();

  const isPending = $derived(form ? form.pending > 0 : loading);
  const type = $derived(reset ? 'reset' : form ? 'submit' : 'button');
</script>

{#if href}
  <ButtonPrimitive.Root class="btn {variant} {className}" {href}>
    {@render children?.()}
  </ButtonPrimitive.Root>
{:else}
  <ButtonPrimitive.Root
    class="btn {variant} {className}"
    disabled={disabled || isPending}
    {type}
    {...restProps}
  >
    {#if isPending}
      <Loader2 class="animate-spin" size={14} />
      {#if loadingMessage}{loadingMessage}{/if}
    {:else}
      {@render children?.()}
    {/if}
  </ButtonPrimitive.Root>
{/if}
