<script generics="T extends Record<string, unknown>, U extends FormPath<T>, M" lang="ts">
  import type { FormPath } from 'sveltekit-superforms';

  import { Checkbox } from '$lib/shadcn/components/ui/checkbox/index.js';
  import { cn } from '$lib/shadcn/utils.js';
  import { Control, Description, Field, Label } from 'formsnap';

  import type { FieldWrapperProps } from '../FieldWrapper.svelte';

  import Errors from '../Errors.svelte';

  interface Props extends FieldWrapperProps<T, U, M> {
    checked?: boolean;
    class?: string;
    disabled?: boolean;
  }

  let {
    checked = $bindable(false),
    class: className,
    description,
    disabled,
    form,
    label,
    name,
    ...restProps
  }: Props = $props();
</script>

<Field {name} {form}>
  <div class={cn('space-y-1', className)}>
    <Control>
      {#snippet children({ props })}
        <div class="flex items-center gap-2">
          <Checkbox
            {disabled}
            bind:checked
            {...props}
            {...restProps}
            class="cursor-pointer hover:border-primary hover:bg-primary/10"
          />
          {#if label}
            <Label
              class="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
              {#if props['aria-required'] === 'true'}
                <span class="text-red-500">*</span>
              {/if}
            </Label>
          {/if}
        </div>
        {#if description}
          <Description class="ml-6 text-sm text-muted-foreground">{description}</Description>
        {/if}
      {/snippet}
    </Control>

    <Errors class="ml-6" />
  </div>
</Field>
