<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  import CheckIcon from '@lucide/svelte/icons/check';
  import MinusIcon from '@lucide/svelte/icons/minus';
  import { Checkbox } from 'bits-ui';

  interface Props extends Omit<HTMLAttributes<HTMLButtonElement>, 'children'> {
    checked?: boolean;
    children?: Snippet;
    class?: string;
    description?: string;
    disabled?: boolean;
    id?: string;
    indeterminate?: boolean;
    name?: string;
    onChecked?: () => void;
    onCheckedChange?: (checked: boolean) => void;
    onUnchecked?: () => void;
    required?: boolean;
  }

  let {
    checked = $bindable(false),
    children,
    class: className,
    description,
    disabled,
    id,
    indeterminate = $bindable(false),
    name,
    onChecked,
    onCheckedChange,
    onUnchecked,
    required,
    ...rest
  }: Props = $props();
</script>

<div class="form-checkbox-wrapper">
  {#if children}
    <label class="form-checkbox-row">
      <Checkbox.Root
        {id}
        {name}
        class={['form-checkbox', className].filter(Boolean).join(' ')}
        {checked}
        {disabled}
        {indeterminate}
        onCheckedChange={(v) => {
          checked = v === true;
          onCheckedChange?.(checked);
          if (checked) onChecked?.();
          else onUnchecked?.();
        }}
        onIndeterminateChange={(v) => (indeterminate = v === true)}
        {required}
        {...rest}
      >
        {#snippet children({ checked, indeterminate })}
          {#if checked}
            <CheckIcon class="form-checkbox-icon" />
          {:else if indeterminate}
            <MinusIcon class="form-checkbox-icon" />
          {/if}
        {/snippet}
      </Checkbox.Root>
      <span class="form-checkbox-label">{@render children()}</span>
    </label>
  {:else}
    <div class="form-checkbox-row">
      <Checkbox.Root
        {id}
        {name}
        class={['form-checkbox', className].filter(Boolean).join(' ')}
        {checked}
        {disabled}
        {indeterminate}
        onCheckedChange={(v) => {
          checked = v === true;
          onCheckedChange?.(checked);
          if (checked) onChecked?.();
          else onUnchecked?.();
        }}
        onIndeterminateChange={(v) => (indeterminate = v === true)}
        {required}
        {...rest}
      >
        {#snippet children({ checked, indeterminate })}
          {#if checked}
            <CheckIcon class="form-checkbox-icon" />
          {:else if indeterminate}
            <MinusIcon class="form-checkbox-icon" />
          {/if}
        {/snippet}
      </Checkbox.Root>
    </div>
  {/if}
  {#if description}
    <p class="form-description form-description--indented">{description}</p>
  {/if}
</div>
