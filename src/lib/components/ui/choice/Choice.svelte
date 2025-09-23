<script lang="ts" generics="T, K extends string | number | symbol">
	import ChoiceInternal, { type ChoiceProps } from './ChoiceInternal.svelte';

	interface Props extends ChoiceProps<T, K> {
		value?: T;
		onChange?: (value: T) => void;
	}

	let { value = $bindable(undefined), onChange, ...props }: Props = $props();

	function handleItemClick(item: T) {
		value = item;
		// Trigger event
		onChange?.(item);
	}

	function isActive(item: T) {
		return value === item;
	}
</script>

<ChoiceInternal {handleItemClick} {isActive} {...props} />
