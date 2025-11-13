<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/shadcn/utils.js';
	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, 'type'> &
			({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		...restProps
	}: Props = $props();
</script>

{#if type === 'file'}
	<input
		bind:this={ref}
		data-slot="input"
		class={cn(
			'w-full rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50',
			'focus:border-transparent focus:ring-2 focus:ring-primary',
			'aria-invalid:border-red-500 aria-invalid:focus:ring-red-300',
			className
		)}
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		data-slot="input"
		class={cn(
			'w-full rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50',
			'focus:border-transparent focus:ring-2 focus:ring-primary',
			'aria-invalid:border-red-500 aria-invalid:focus:ring-red-300',
			className
		)}
		{type}
		bind:value
		{...restProps}
	/>
{/if}
