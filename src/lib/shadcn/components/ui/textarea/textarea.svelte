<script lang="ts">
	import { cn, type WithElementRef, type WithoutChildren } from '$lib/shadcn/utils.js';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		'data-slot': dataSlot = 'textarea',
		...restProps
	}: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props();
</script>

<textarea
	bind:this={ref}
	data-slot={dataSlot}
	class={cn(
		'w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none',
		'transition-[border-color,box-shadow,opacity]',
		'focus:border-transparent focus:ring-2 focus:ring-primary',
		'disabled:cursor-not-allowed disabled:opacity-50',
		'aria-invalid:border-red-500 aria-invalid:focus:ring-red-300',
		className
	)}
	bind:value
	{...restProps}
></textarea>
