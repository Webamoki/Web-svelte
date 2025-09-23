<script lang="ts" generics="T, K extends string | number | symbol">
	import ChoiceInternal, { type ChoiceProps } from './ChoiceInternal.svelte';
	import * as sorted from 'sorted-array-functions';

	interface Props extends ChoiceProps<T, K> {
		value: T[];
		onAdd?: (value: T) => void;
		onRemove?: (value: T) => void;
		/** Compare items for sorting
		 * @returns negative if a < b, 0 if a == b, positive if a > b
		 */
		compareItems: (a: T, b: T) => number;
	}

	let {
		value = $bindable([]),
		onAdd,
		onRemove,
		compareItems: _compare,
		...props
	}: Props = $props();

	function compareItems(a: T, b: T) {
		// Clamp to -1, 0, 1
		return Math.sign(_compare(a, b)) as -1 | 0 | 1;
	}

	function contains(item: T) {
		// Sorted contains function
		return sorted.has(value, item, compareItems);
	}

	function handleItemClick(item: T) {
		// Toggle add or remove
		if (!contains(item)) {
			sorted.add(value, item, compareItems);
			// Trigger event
			onAdd?.(item);
		} else {
			sorted.remove(value, item, compareItems);
			// Trigger event
			onRemove?.(item);
		}

		// Re-assign value to trigger state update
		value = value;
	}
</script>

<ChoiceInternal {handleItemClick} isActive={contains} {...props} />
