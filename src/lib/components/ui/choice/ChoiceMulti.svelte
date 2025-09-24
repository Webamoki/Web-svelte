<script lang="ts" module>
	export interface ChoiceMultiProps<V, K extends string | number | symbol>
		extends ChoiceInternalProps<V, K> {
		value: V[];
		onAdd?: (value: V) => void;
		onRemove?: (value: V) => void;
	}
</script>

<script lang="ts" generics="V, K extends string | number | symbol">
	import ChoiceInternal, { type ChoiceInternalProps } from './ChoiceInternal.svelte';
	import * as sorted from 'sorted-array-functions';

	let {
		value = $bindable([]),
		onAdd,
		onRemove,
		items,
		...props
	}: ChoiceMultiProps<V, K> = $props();

	const valueIndex = new Map<V, number>(items.map((item, index) => [item, index] as const));

	function compareItems(a: V, b: V) {
		const index1 = valueIndex.get(a);
		if (index1 === undefined) return 1;
		const index2 = valueIndex.get(b);
		if (index2 === undefined) return -1;

		return Math.sign(index1 - index2) as -1 | 0 | 1;
	}

	function contains(item: V) {
		// Sorted contains function
		return sorted.has(value, item, compareItems);
	}

	function handleItemClick(item: V) {
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
