<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>, M">
	import IconInputWrapper from '$lib/components/form/IconInputWrapper.svelte';
	import { Input } from '$lib/shadcn/components/ui/input/index.js';
	import { cn } from '$lib/shadcn/utils.js';
	import type { Component } from 'svelte';
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

	interface Props extends FieldWrapperProps<T, U, M> {
		value?: string;
		type?: HTMLInputElement['type'];
		class?: string;
		placeholder?: string;
		icon?: Component;
	}
	let {
		value = $bindable(),
		type = 'text',
		class: className,
		placeholder,
		icon,
		...fieldProps
	}: Props = $props();
</script>

<FieldWrapper {...fieldProps}>
	{#snippet formElem(props)}
		<IconInputWrapper {icon}>
			{#snippet children({ class: iconClass })}
				<Input {type} bind:value class={cn(iconClass, className)} {placeholder} {...props} />
			{/snippet}
		</IconInputWrapper>
	{/snippet}
</FieldWrapper>
