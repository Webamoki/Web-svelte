<script generics="T extends Record<string, unknown>, U extends FormPath<T>, M" lang="ts">
  import type { FormPath } from 'sveltekit-superforms';

  import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot
  } from '$lib/shadcn/components/ui/input-otp/index.js';

  import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

  interface Props extends FieldWrapperProps<T, U, M> {
    class?: string;
    disabled?: boolean;
    maxlength?: number;
    value?: string;
  }

  let {
    class: className,
    disabled,
    maxlength = 6,
    value = $bindable(''),
    ...fieldProps
  }: Props = $props();
</script>

<FieldWrapper class={className} {...fieldProps}>
  {#snippet formElem(props)}
    <InputOTP {disabled} {maxlength} textalign="center" bind:value {...props}>
      {#snippet children({ cells })}
        {@const half = Math.ceil(maxlength / 2)}
        <InputOTPGroup>
          {#each cells.slice(0, half) as cell (cell)}
            <InputOTPSlot {cell} />
          {/each}
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          {#each cells.slice(half) as cell (cell)}
            <InputOTPSlot {cell} />
          {/each}
        </InputOTPGroup>
      {/snippet}
    </InputOTP>
  {/snippet}
</FieldWrapper>
