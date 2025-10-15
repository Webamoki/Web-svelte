<script lang="ts" module>
	export interface ChoiceProps<V, I, K extends string | number | symbol>
		extends ChoiceInternalProps<V, I, K> {
		value?: V;
		onChange?: (value: V) => void;
	}
</script>

<script lang="ts" generics="V, I,  K extends string | number | symbol">
	import ChoiceInternal, { type ChoiceInternalProps } from './ChoiceInternal.svelte';

	let {
		value = $bindable(undefined),
		getValue,
		onChange,
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

<ChoiceInternal {handleItemClick} {isActive} {getValue} {...props} />
