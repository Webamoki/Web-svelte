import { createSubscriber } from 'svelte/reactivity';

export class DragManager<T> {
	#dragData: T | null = null;

	#subscribe;
	#update = () => {};

	constructor() {
		this.#subscribe = createSubscriber((update) => {
			this.#update = update;
			return () => {};
		});
	}

	drag(dragData: T) {
		this.#dragData = dragData;
		this.#update();
	}

	stop() {
		this.#dragData = null;
		this.#update();
	}

	get isDragging(): boolean {
		this.#subscribe();
		return this.#dragData !== null;
	}

	get dragData(): T | null {
		this.#subscribe();
		return this.#dragData;
	}
}
