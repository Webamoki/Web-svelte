<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import type { ContextMenuState } from './ContextMenu.svelte';

	interface Props {
		children: Snippet<[]>;
	}

	let { children }: Props = $props();

	const menuState: ContextMenuState = getContext('context-menu');

	function handleContextMenu(event: MouseEvent) {
		event.preventDefault();
		menuState.position.x = event.clientX;
		menuState.position.y = event.clientY;
		menuState.open = true;
	}
</script>

<div role="button" tabindex="-1" oncontextmenu={handleContextMenu}>
	{@render children()}
</div>
