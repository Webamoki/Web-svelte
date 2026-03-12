import { createSubscriber } from 'svelte/reactivity';

export class DragManager<T> {
  get dragData(): null | T {
    this.#subscribe();
    return this.#dragData;
  }

  get isDragging(): boolean {
    this.#subscribe();
    return this.#dragData !== null;
  }
  #dragData: null | T = null;

  #subscribe;

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

  #update = () => {};
}
