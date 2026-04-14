<script generics="T extends Record<string, unknown>, U extends FormPath<T>, M" lang="ts">
  import type { CalendarDate } from '@internationalized/date';
  import type { Component } from 'svelte';
  import type { FormPath } from 'sveltekit-superforms';

  import DateInput from '$lib/shared/components/ui/DateInput.svelte';

  import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

  interface Props extends FieldWrapperProps<T, U, M> {
    class?: string;
    icon?: Component;
    showDate?: boolean;
    value?: CalendarDate;
  }
  let {
    class: className,
    icon,
    showDate = false,
    value = $bindable(),
    ...fieldProps
  }: Props = $props();
</script>

<FieldWrapper {...fieldProps}>
  {#snippet formElem()}
    <DateInput class={className} {icon} {showDate} bind:value />
  {/snippet}
</FieldWrapper>
