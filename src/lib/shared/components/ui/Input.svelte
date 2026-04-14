<script lang="ts">
  import type { Component } from 'svelte';
  import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';

  import { Input as ShadInput } from '$lib/shadcn/components/ui/input/index.js';
  import { cn } from '$lib/shadcn/utils.js';
  import IconInputWrapper from '$lib/shared/components/form/IconInputWrapper.svelte';

  type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

  type Props = Omit<HTMLInputAttributes, 'files' | 'type'> & {
    class?: string;
    icon?: Component;
    type?: InputType;
    value?: string;
  };
  let { class: className, icon, type = 'text', value = $bindable(), ...rest }: Props = $props();
</script>

<IconInputWrapper {icon}>
  {#snippet children({ class: iconClass })}
    <ShadInput class={cn(iconClass, className)} {type} bind:value {...rest} />
  {/snippet}
</IconInputWrapper>
