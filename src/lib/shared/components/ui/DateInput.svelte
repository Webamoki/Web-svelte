<script lang="ts">
  import type { Component } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';

  import { Input as ShadInput } from '$lib/shadcn/components/ui/input/index.js';
  import { cn } from '$lib/shadcn/utils.js';
  import IconInputWrapper from '$lib/shared/components/form/IconInputWrapper.svelte';
  import { formatDateFull } from '$lib/shared/utils/datetime/index.js';
  import { CalendarDate } from '@internationalized/date';

  type Props = Omit<HTMLInputAttributes, 'files' | 'type' | 'value'> & {
    class?: string;
    icon?: Component;
    showDate?: boolean;
    value?: CalendarDate;
  };
  let { class: className, icon, showDate = false, value = $bindable(), ...rest }: Props = $props();

  function get(): string {
    if (!value) return '';
    const yyyy = String(value.year).padStart(4, '0');
    const mm = String(value.month).padStart(2, '0');
    const dd = String(value.day).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function set(raw: string) {
    if (!raw) {
      value = undefined;
      return;
    }
    const [yyyy, mm, dd] = raw.split('-').map(Number);
    if (yyyy && mm && dd) {
      value = new CalendarDate(yyyy, mm, dd);
    }
  }
</script>

<IconInputWrapper {icon}>
  {#snippet children({ class: iconClass })}
    <ShadInput class={cn(iconClass, className)} type="date" bind:value={get, set} {...rest} />
  {/snippet}
</IconInputWrapper>
{#if showDate && value !== undefined}
  <p class="text-sm italic">{formatDateFull(value)}</p>
{/if}
