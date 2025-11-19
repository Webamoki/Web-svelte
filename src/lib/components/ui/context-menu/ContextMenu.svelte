<script lang="ts" module>
	export type ContextMenuState = {
		position: { x: number; y: number };
		open: boolean;
	};
</script>

<script lang="ts">
	import { setContext, onDestroy, type Snippet } from 'svelte';
	import { contextMenuState } from './context-menu-state.svelte';

	interface Props {
		children: Snippet<[]>;
		onOpenChange?: (open: boolean) => void;
	}

	let { children, onOpenChange }: Props = $props();

	const menuId = Symbol('context-menu');

	let menuState = $state<ContextMenuState>({
		position: { x: 0, y: 0 },
		open: false
	});

	// Watch for changes to menuState.open and sync with global store
	$effect(() => {
		if (menuState.open) {
			contextMenuState.openMenu(menuId);
		} else if (contextMenuState.isThisMenuOpen(menuId)) {
			contextMenuState.closeMenu();
		}
	});

	// Watch for global store changes and close this menu if another opens
	$effect(() => {
		if (contextMenuState.open && !contextMenuState.isThisMenuOpen(menuId)) {
			menuState.open = false;
		}
	});

	// Call onOpenChange callback when open state changes
	$effect(() => {
		onOpenChange?.(menuState.open);
	});

	// Cleanup scroll lock when component is destroyed
	onDestroy(() => {
		if (contextMenuState.isThisMenuOpen(menuId)) {
			contextMenuState.closeMenu();
		}
	});

	setContext('context-menu', menuState);
</script>

{@render children()}
