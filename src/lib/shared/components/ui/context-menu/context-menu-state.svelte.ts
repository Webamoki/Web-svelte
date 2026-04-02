const globalMenuState = $state<{ id: null | symbol; open: boolean }>({
  id: null,
  open: false
});

export const contextMenuState = {
  closeMenu() {
    globalMenuState.open = false;
    globalMenuState.id = null;
    // Restore scrolling when menu closes
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  },
  get currentId() {
    return globalMenuState.id;
  },
  isThisMenuOpen(id: symbol) {
    return globalMenuState.open && globalMenuState.id === id;
  },
  get open() {
    return globalMenuState.open;
  },
  openMenu(id: symbol) {
    globalMenuState.open = true;
    globalMenuState.id = id;
    // Prevent scrolling when menu opens
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }
};
