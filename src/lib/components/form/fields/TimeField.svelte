<script generics="T extends Record<string, unknown>, U extends FormPath<T>, M" lang="ts">
	import type { Component } from 'svelte';
	import type { FormPath } from 'sveltekit-superforms';

	import IconInputWrapper from '$lib/components/form/IconInputWrapper.svelte';
	import { Input } from '$lib/shadcn/components/ui/input/index.js';
	import { cn } from '$lib/shadcn/utils.js';
	import { Time } from '@internationalized/date';

	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

	interface Props extends FieldWrapperProps<T, U, M> {
		class?: string;
		icon?: Component;
		placeholder?: string;
		step?: HTMLInputElement['step'];
		value?: Time;
	}
	let {
		class: className,
		icon,
		placeholder,
		step,
		value = $bindable(),
		...fieldProps
	}: Props = $props();
	// Getter: format Time as string depending on step
	function get(): string {
		if (!value) return '00:00:00';
		const hh = String(value.hour).padStart(2, '0');
		const mm = String(value.minute).padStart(2, '0');

		// If step < 60, include seconds
		if (!step || Number(step) < 60) {
			const ss = String(value.second).padStart(2, '0');
			return `${hh}:${mm}:${ss}`;
		}

		return `${hh}:${mm}`;
	}

	// Setter: parse string into Time depending on step
	function set(raw: string) {
		if (!raw) {
			value = undefined;
			return;
		}
		const parts = raw.split(':').map(Number);
		if (parts.length === 2) {
			const [hh, mm] = parts;
			value = new Time(hh, mm);
		} else if (parts.length === 3) {
			const [hh, mm, ss] = parts;
			value = new Time(hh, mm, ss);
		}
	}
</script>

<FieldWrapper {...fieldProps}>
	{#snippet formElem(props)}
		<IconInputWrapper {icon}>
			{#snippet children({ class: iconClass })}
				<Input
					class={cn(iconClass, className)}
					{placeholder}
					{step}
					type="time"
					bind:value={get, set}
					{...props}
				/>
			{/snippet}
		</IconInputWrapper>
	{/snippet}
</FieldWrapper>
