<script lang="ts" generics="V,T extends Record<string, unknown>, U extends FormPath<T>, M">
	import IconInputWrapper from '$lib/components/form/IconInputWrapper.svelte';
	import { Input } from '$lib/shadcn/components/ui/input/index.js';
	import { cn } from '$lib/shadcn/utils.js';
	import type { Component } from 'svelte';
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

	interface Props extends FieldWrapperProps<T, U, M> {
		value?: V;
		class?: string;
		step?: HTMLInputElement['step'];
		placeholder?: string;
		icon?: Component;
	}
	let {
		value = $bindable(),
		class: className,
		step,
		placeholder,
		icon,
		...fieldProps
	}: Props = $props();
</script>

<FieldWrapper {...fieldProps}>
	{#snippet formElem(props)}
		<IconInputWrapper {icon}>
			{#snippet children({ class: iconClass })}
				<Input
					type="number"
					bind:value
					class={cn(iconClass, className)}
					{placeholder}
					{step}
					{...props}
				/>
			{/snippet}
		</IconInputWrapper>
	{/snippet}
</FieldWrapper>
