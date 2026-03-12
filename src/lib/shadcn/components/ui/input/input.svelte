<script lang="ts">
  import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';

  import { cn, type WithElementRef } from '$lib/shadcn/utils.js';
  type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

  type Props = WithElementRef<
    Omit<HTMLInputAttributes, 'type'> &
      ({ files?: FileList; type: 'file' } | { files?: undefined; type?: InputType })
  >;

  let {
    class: className,
    files = $bindable(),
    ref = $bindable(null),
    type,
    value = $bindable(),
    ...restProps
  }: Props = $props();

  let inputClasses = $derived(
    cn(
      'w-full rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none',
      'focus:border-transparent focus:ring-2 focus:ring-primary',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'aria-invalid:border-red-500 aria-invalid:focus:ring-red-300',
      className
    )
  );
</script>

{#if type === 'file'}
  <input
    bind:this={ref}
    class={inputClasses}
    data-slot="input"
    type="file"
    bind:files
    bind:value
    {...restProps}
  />
{:else}
  <input bind:this={ref} class={inputClasses} data-slot="input" {type} bind:value {...restProps} />
{/if}
