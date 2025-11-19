<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import type { DragManager } from './drag-manager.js';
	import { LucideArrowDown } from '@lucide/svelte';

	interface Props {
		isDroppable: (data: T) => boolean;
		onDrop: (data: T) => void;
		manager: DragManager<T>;
		children: Snippet<[]>;
		class?: string;
	}
	let { isDroppable, onDrop, manager, children, class: className = '' }: Props = $props();

	let isOver = $state(false);

	let canDrop = $derived(manager.isDragging && isDroppable(manager.dragData!));

	// --- Event Handlers ---

	function handleMouseEnter() {
		// Only track 'isOver' if a drag is active
		if (manager.isDragging) {
			isOver = true;
		}
	}

	function handleMouseLeave() {
		isOver = false;
	}

	function handleMouseUp() {
		if (isOver && canDrop) {
			onDrop(manager.dragData as T);
			manager.stop();
		}
		isOver = false;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onmouseup={handleMouseUp}
	class={`relative p-4 transition-colors duration-150 ${className}
    ${
			// Zero Layout Shift: always reserve the same border width to prevent layout flicker.
			// Use transparent border when not droppable so sizing remains constant.
			!manager.isDragging
				? 'border-2 border-dashed border-transparent'
				: canDrop
					? 'border-2 border-dashed border-gray-400'
					: 'border-2 border-dashed border-transparent'
		}`}
>
	{@render children()}

	{#if isOver && canDrop}
		<div
			class="absolute inset-0 z-10 flex flex-col items-center justify-center
             bg-gray-200/50 p-4 backdrop-blur-none"
		>
			<LucideArrowDown class="h-16 w-16 animate-bounce text-gray-700" />
		</div>
	{/if}

	{#if isOver && !canDrop}
		<div class="absolute inset-0 z-10" aria-label="Cannot drop here"></div>
	{/if}
</div>
