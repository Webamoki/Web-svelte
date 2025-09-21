<script lang="ts" generics="V">
	import { cn } from '$lib/shadcn/utils.js';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		value?: V;
		error?: boolean;
	}

	let {
		value = $bindable(),
		class: className,
		error = false,
		disabled = false,
		readonly = false,
		...props
	}: Props = $props();
</script>

<input
	class={cn(
		'w-full rounded-md border px-3 py-2 text-sm transition-all duration-150 outline-none',
		disabled && 'cursor-not-allowed bg-gray-100 opacity-60',
		readonly && 'bg-gray-50',
		!error &&
			'border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
		error &&
			'border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200',
		className
	)}
	bind:value
	{disabled}
	{readonly}
	{...props}
/>
