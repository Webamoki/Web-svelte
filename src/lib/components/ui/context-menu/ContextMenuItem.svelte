<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/shadcn/utils.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		disabled?: boolean;
		variant?: 'default' | 'destructive';
	}

	let {
		children,
		class: className,
		disabled = false,
		onclick,
		variant = 'default',
		...restProps
	}: Props = $props();
</script>

<div
	class={cn(
		'flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm hover:bg-gray-100',
		variant === 'destructive' && 'text-red-600 hover:bg-red-50',
		disabled && 'pointer-events-none opacity-50',
		className
	)}
	{onclick}
	role="menuitem"
	tabindex={disabled ? -1 : 0}
	{...restProps}
>
	{@render children?.()}
</div>
