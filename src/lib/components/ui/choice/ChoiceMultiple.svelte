<script lang="ts" generics="T, K extends string | number | symbol">
	import ChoiceInternal, { type ChoiceProps } from './ChoiceInternal.svelte';
	import * as sorted from 'sorted-array-functions';

	interface Props extends ChoiceProps<T, K> {
		value: T[];
		onAdd?: (value: T) => void;
		onRemove?: (value: T) => void;
	}

	let { value = $bindable([]), onAdd, onRemove, items, ...props }: Props = $props();

	const valueIndex = new Map<T, number>(items.map((item, index) => [item, index] as const));

	function compareItems(a: T, b: T) {
		const index1 = valueIndex.get(a);
		if (index1 === undefined) return 1;
		const index2 = valueIndex.get(b);
		if (index2 === undefined) return -1;

		return Math.sign(index1 - index2) as -1 | 0 | 1;
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

<ChoiceInternal {handleItemClick} isActive={contains} {items} {...props} />
