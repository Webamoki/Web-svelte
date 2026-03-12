<script generics="T extends Record<string, unknown>, U extends FormPath<T>, M" lang="ts">
	import type { Component } from 'svelte';
	import type { FormPath } from 'sveltekit-superforms';

	import IconInputWrapper from '$lib/components/form/IconInputWrapper.svelte';
	import { Textarea } from '$lib/shadcn/components/ui/textarea/index.js';
	import { cn } from '$lib/shadcn/utils.js';

	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

	interface Props extends FieldWrapperProps<T, U, M> {
		class?: string;
		defaultHeight?: number;
		icon?: Component;
		placeholder?: string;
		resize?: boolean;
		value?: string;
	}
	let {
		class: className,
		defaultHeight = 100,
		icon,
		placeholder,
		resize = false,
		value = $bindable(),
		...fieldProps
	}: Props = $props();
</script>

<FieldWrapper {...fieldProps}>
	{#snippet formElem(props)}
		<!-- Textarea itself with optional left icon -->
		<IconInputWrapper flex {icon} iconPosition="top">
			{#snippet children({ class: iconClass })}
				<Textarea
					style="height: {defaultHeight}px; min-height: {defaultHeight}px;"
					class={cn(resize ? 'resize-y' : 'resize-none', iconClass, className)}
					{placeholder}
					bind:value
					{...props}
				/>
			{/snippet}
		</IconInputWrapper>
	{/snippet}
</FieldWrapper>
