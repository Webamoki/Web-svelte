<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>, M">
	import IconInputWrapper from '$lib/components/form/IconInputWrapper.svelte';
	import { Input } from '$lib/shadcn/components/ui/input/index.js';
	import { cn } from '$lib/shadcn/utils.js';
	import { CalendarDate } from '@internationalized/date';
	import type { Component } from 'svelte';
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

	interface Props extends FieldWrapperProps<T, U, M> {
		value?: CalendarDate;
		class?: string;
		icon?: Component;
	}
	let { value = $bindable(), class: className, icon, ...fieldProps }: Props = $props();

	// Getter: format CalendarDate → string (YYYY-MM-DD)
	function get(): string {
		if (!value) return '';
		const yyyy = String(value.year).padStart(4, '0');
		const mm = String(value.month).padStart(2, '0');
		const dd = String(value.day).padStart(2, '0');
		return `${yyyy}-${mm}-${dd}`;
	}

	// Setter: parse string → CalendarDate
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

<FieldWrapper {...fieldProps}>
	{#snippet formElem(props)}
		<IconInputWrapper {icon}>
			{#snippet children({ class: iconClass })}
				<Input type="date" bind:value={get, set} class={cn(iconClass, className)} {...props} />
			{/snippet}
		</IconInputWrapper>
	{/snippet}
</FieldWrapper>
