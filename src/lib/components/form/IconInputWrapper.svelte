<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	interface Props {
		children: Snippet<[{ class: string }]>;
		/**
		 * Whether this wrapper should grow to fill flex container (used in layouts with buttons)
		 */
		flex?: boolean;
		icon?: Component;
		/**
		 * Position of the icon vertically.
		 * - 'center': Centers vertically (for single-line inputs)
		 * - 'top': Aligns to top with padding (for multi-line inputs like textarea)
		 */
		iconPosition?: 'center' | 'top';
	}

	let { children, flex = false, icon, iconPosition = 'center' }: Props = $props();

	let iconClass = $derived(
		iconPosition === 'top'
			? 'pointer-events-none absolute top-4 left-4 text-gray-500'
			: 'pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-500'
	);

	let wrapperClass = $derived(flex ? 'relative flex-1' : 'relative');
</script>

{#if icon}
	{@const Icon = icon}
	<div class={wrapperClass}>
		<div class={iconClass}>
			<Icon class="size-5" />
		</div>
		{@render children({ class: 'pl-12' })}
	</div>
{:else}
	{@render children({ class: '' })}
{/if}
