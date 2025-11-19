<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: 'default' | 'destructive';
		disabled?: boolean;
	}

	let {
		class: className,
		variant = 'default',
		disabled = false,
		onclick,
		children,
		...restProps
	}: Props = $props();
</script>

<div
	role="menuitem"
	tabindex={disabled ? -1 : 0}
	class="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm hover:bg-gray-100 {variant ===
	'destructive'
		? 'text-red-600 hover:bg-red-50'
		: ''} {disabled ? 'pointer-events-none opacity-50' : ''} {className || ''}"
	{onclick}
	{...restProps}
>
	{@render children?.()}
</div>
