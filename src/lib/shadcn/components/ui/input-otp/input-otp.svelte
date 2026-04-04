<script lang="ts">
  import { cn } from '$lib/shadcn/utils.js';
  import { PinInput as InputOTPPrimitive } from 'bits-ui';

  let {
    class: className,
    ref = $bindable(null),
    value = $bindable(''),
    ...restProps
  }: InputOTPPrimitive.RootProps = $props();
</script>

<InputOTPPrimitive.Root
  class={cn(
    'cn-input-otp-input flex items-center gap-2 disabled:cursor-not-allowed has-disabled:opacity-50',
    className
  )}
  data-slot="input-otp"
  spellcheck={false}
  bind:ref
  bind:value
  {...restProps}
/>
