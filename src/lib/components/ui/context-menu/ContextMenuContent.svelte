<script lang="ts">
	import { getContext, onMount, type Snippet } from 'svelte';
	import { scale } from 'svelte/transition';
	import type { ContextMenuState } from './ContextMenu.svelte';
	import { cn } from '$lib/shadcn/utils.js';

	interface Props {
		children: Snippet<[]>;
		class?: string;
	}

	let { children, class: className }: Props = $props();

	const menuState: ContextMenuState = getContext('context-menu');

	let menuElement: HTMLDivElement | null = $state(null);
	let adjustedPosition = $state({ x: 0, y: 0 });

	function handleDocumentClick(event: MouseEvent) {
		if (menuElement && !menuElement.contains(event.target as Node)) {
			menuState.open = false;
		}
	}

	function adjustPositionToFitScreen() {
		if (!menuElement) return;

		const rect = menuElement.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		let x = menuState.position.x;
		let y = menuState.position.y;

		// Adjust horizontal position if menu goes off right edge
		if (x + rect.width > viewportWidth) {
			x = viewportWidth - rect.width - 8; // 8px padding from edge
		}

		// Adjust horizontal position if menu goes off left edge
		if (x < 0) {
			x = 8; // 8px padding from edge
		}

		// Adjust vertical position if menu goes off bottom edge
		if (y + rect.height > viewportHeight) {
			y = viewportHeight - rect.height - 8; // 8px padding from edge
		}

		// Adjust vertical position if menu goes off top edge
		if (y < 0) {
			y = 8; // 8px padding from edge
		}

		adjustedPosition = { x, y };
	}

	$effect(() => {
		if (menuState.open && menuElement) {
			// Use requestAnimationFrame to ensure DOM has updated
			requestAnimationFrame(() => {
				adjustPositionToFitScreen();
			});
		}
	});

	onMount(() => {
		document.addEventListener('click', handleDocumentClick);

		return () => {
			document.removeEventListener('click', handleDocumentClick);
		};
	});
</script>

{#if menuState.open}
	<div
		bind:this={menuElement}
		class={cn('context-menu-content', className)}
		style="left: {adjustedPosition.x}px; top: {adjustedPosition.y}px;"
		transition:scale={{ duration: 150, start: 0.95 }}
	>
		{@render children()}
	</div>
{/if}

<style>
	.context-menu-content {
		position: fixed;
		background-color: white;
		border: 1px solid #ddd;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		padding: 4px;
		min-width: 150px;
		z-index: 50;
		transform-origin: top left;
	}
</style>
