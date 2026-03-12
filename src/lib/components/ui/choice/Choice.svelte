<script lang="ts" module>
	export interface ChoiceProps<
		V,
		I,
		K extends number | string | symbol
	> extends ChoiceInternalProps<V, I, K> {
		onChange?: (value: V) => void;
		value?: V;
	}
</script>

<script generics="V, I,  K extends number | string | symbol" lang="ts">
	import ChoiceInternal, { type ChoiceInternalProps } from './ChoiceInternal.svelte';

	let {
		getValue,
		onChange,
		value = $bindable(undefined),
		...props
	}: ChoiceProps<V, I, K> = $props();

	function handleItemClick(item: I) {
		value = getValue(item);
		// Trigger event
		onChange?.(value);
	}

	function isActive(item: I) {
		return value === getValue(item);
	}
</script>

<ChoiceInternal {getValue} {handleItemClick} {isActive} {...props} />
