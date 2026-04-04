<script lang="ts">
  import { cn } from '$lib/shadcn/utils.js';
  import { PinInput as InputOTPPrimitive } from 'bits-ui';

  let {
    cell,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: InputOTPPrimitive.CellProps = $props();
</script>

<InputOTPPrimitive.Cell
  class={cn(
    'relative flex size-8 items-center justify-center border-y border-r border-input text-sm transition-all outline-none first:rounded-l-lg first:border-l last:rounded-r-lg aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40',
    className
  )}
  {cell}
  data-slot="input-otp-slot"
  bind:ref
  {...restProps}
>
  {cell.char}
  {#if cell.hasFakeCaret}
    <div
      class="cn-input-otp-caret pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div class="h-4 w-px animate-caret-blink bg-foreground duration-1000"></div>
    </div>
  {/if}
</InputOTPPrimitive.Cell>
