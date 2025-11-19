<script lang="ts" generics="T">
	import { onDestroy, type Snippet } from 'svelte';
	import type { DragManager } from './drag-manager.js';

	interface Props {
		data: T;
		manager: DragManager<T>;
		children: Snippet<[]>;
		class?: string;
	}

	let { manager, children, class: className, data }: Props = $props();

	let isDragging = $state(false);
	let mouseX = $state(0);
	let mouseY = $state(0);

	function startDrag(e: MouseEvent) {
		if (e.button !== 0) return;

		e.preventDefault();
		isDragging = true;
		manager.drag(data);

		mouseX = e.clientX;
		mouseY = e.clientY;

		// Force grabbing cursor on the body
		document.body.style.cursor = 'grabbing';

		window.addEventListener('mousemove', moveDrag);
		window.addEventListener('mouseup', endDrag);
	}

	function moveDrag(e: MouseEvent) {
		mouseX = e.clientX;
		mouseY = e.clientY;
	}

	function endDrag() {
		isDragging = false;
		manager.stop();

		// Reset cursor
		document.body.style.cursor = '';

		window.removeEventListener('mousemove', moveDrag);
		window.removeEventListener('mouseup', endDrag);
	}

	onDestroy(() => {
		if (isDragging) {
			manager.stop();
		}
		if (typeof window !== 'undefined') {
			window.removeEventListener('mousemove', moveDrag);
			window.removeEventListener('mouseup', endDrag);
			document.body.style.cursor = ''; // safe in browser only
		}
	});
</script>

<div
	onmousedown={startDrag}
	class={`relative select-none ${isDragging ? 'opacity-30 grayscale' : 'cursor-grab'} ${className ?? ''}`}
	role="button"
	tabindex="0"
	aria-label="Draggable item"
>
	{@render children()}
</div>

{#if isDragging}
	<div
		class="pointer-events-none fixed z-9999 -translate-x-1/2 -translate-y-1/2 scale-115 transform opacity-95 shadow-xl"
		style={`top:${mouseY}px; left:${mouseX}px;`}
	>
		{@render children()}
	</div>
{/if}
