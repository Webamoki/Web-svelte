<script lang="ts" module>
	export interface ChoiceMultiProps<
		V,
		I,
		K extends number | string | symbol
	> extends ChoiceInternalProps<V, I, K> {
		onAdd?: (value: V) => void;
		onRemove?: (value: V) => void;
		value: V[];
	}
</script>

<script generics="V,I, K extends number | string | symbol" lang="ts">
	import * as sorted from 'sorted-array-functions';

	import ChoiceInternal, { type ChoiceInternalProps } from './ChoiceInternal.svelte';

	let {
		getValue,
		items,
		onAdd,
		onRemove,
		value = $bindable([]),
		...props
	}: ChoiceMultiProps<V, I, K> = $props();

	// Items property shouldn't be updated, ignore warning
	// svelte-ignore state_referenced_locally
	const valueIndex = new Map<V, number>(
		items.map((item, index) => [getValue(item), index] as const)
	);

	function compareItems(a: V, b: V) {
		const index1 = valueIndex.get(a);
		if (index1 === undefined) return 1;
		const index2 = valueIndex.get(b);
		if (index2 === undefined) return -1;

		return Math.sign(index1 - index2) as -1 | 0 | 1;
	}

	function contains(item: I) {
		// Sorted contains function
		return sorted.has(value, getValue(item), compareItems);
	}

	function handleItemClick(item: I) {
		// Toggle add or remove
		if (!contains(item)) {
			sorted.add(value, getValue(item), compareItems);
			// Trigger event
			onAdd?.(getValue(item));
		} else {
			sorted.remove(value, getValue(item), compareItems);
			// Trigger event
			onRemove?.(getValue(item));
		}

		// Re-assign value to trigger state update
		value = value;
	}
</script>

<ChoiceInternal {getValue} {handleItemClick} isActive={contains} {items} {...props} />
