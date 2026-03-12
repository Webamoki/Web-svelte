<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	import { cn, type WithElementRef, type WithoutChildren } from '$lib/shadcn/utils.js';

	let {
		class: className,
		'data-slot': dataSlot = 'textarea',
		ref = $bindable(null),
		value = $bindable(),
		...restProps
	}: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props();
</script>

<textarea
	bind:this={ref}
	class={cn(
		'w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none',
		'transition-[border-color,box-shadow,opacity]',
		'focus:border-transparent focus:ring-2 focus:ring-primary',
		'disabled:cursor-not-allowed disabled:opacity-50',
		'aria-invalid:border-red-500 aria-invalid:focus:ring-red-300',
		className
	)}
	data-slot={dataSlot}
	bind:value
	{...restProps}
></textarea>
