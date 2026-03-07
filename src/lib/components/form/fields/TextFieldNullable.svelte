<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>, M">
	import { Input } from '$lib/shadcn/components/ui/input/index.js';
	import { cn } from '$lib/shadcn/utils.js';
	import type { Component } from 'svelte';
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

	interface Props extends FieldWrapperProps<T, U, M> {
		value?: string | null;
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

	function get() {
		if (!value) return '';
		return value;
	}
	function set(raw: string | undefined) {
		value = raw || null;
	}
</script>

<FieldWrapper {...fieldProps}>
	{#snippet formElem(props)}
		{#if icon}
			{@const Icon = icon}
			<div class="relative">
				<div class="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-500">
					<Icon class="size-5" />
				</div>
				<Input
					{type}
					bind:value={get, set}
					class={cn('pl-12', className)}
					{placeholder}
					{...props}
				/>
			</div>
		{:else}
			<Input {type} bind:value={get, set} class={className} {placeholder} {...props} />
		{/if}
	{/snippet}
</FieldWrapper>
