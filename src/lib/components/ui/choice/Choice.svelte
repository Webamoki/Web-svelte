<script lang="ts" module>
	export interface ChoiceProps<V, K extends string | number | symbol>
		extends ChoiceInternalProps<V, K> {
		value?: V;
		onChange?: (value: V) => void;
	}
</script>

<script lang="ts" generics="V, K extends string | number | symbol">
	import ChoiceInternal, {
		type ChoiceInternalProps as ChoiceInternalProps
	} from './ChoiceInternal.svelte';

	let { value = $bindable(undefined), onChange, ...props }: ChoiceProps<V, K> = $props();

	function handleItemClick(item: V) {
		value = item;
		// Trigger event
		onChange?.(item);
	}

	function isActive(item: V) {
		return value === item;
	}
</script>

<ChoiceInternal {handleItemClick} {isActive} {...props} />
