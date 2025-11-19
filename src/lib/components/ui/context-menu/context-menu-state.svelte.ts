const globalMenuState = $state<{ open: boolean; id: symbol | null }>({
	open: false,
	id: null
});

export const contextMenuState = {
	get open() {
		return globalMenuState.open;
	},
	get currentId() {
		return globalMenuState.id;
	},
	openMenu(id: symbol) {
		globalMenuState.open = true;
		globalMenuState.id = id;
		// Prevent scrolling when menu opens
		if (typeof document !== 'undefined') {
			document.body.style.overflow = 'hidden';
		}
	},
	closeMenu() {
		globalMenuState.open = false;
		globalMenuState.id = null;
		// Restore scrolling when menu closes
		if (typeof document !== 'undefined') {
			document.body.style.overflow = '';
		}
	},
	isThisMenuOpen(id: symbol) {
		return globalMenuState.open && globalMenuState.id === id;
	}
};
