<script lang="ts" module>
	export interface WeekdayChoiceMultiProps {
		value: string[];
		onAdd?: (value: string) => void;
		onRemove?: (value: string) => void;
		vertical?: boolean;
		longLabels?: boolean;
		shortLabels?: boolean;
		disabled?: boolean | null;
		readonly?: boolean | null;
	}
</script>

<script lang="ts">
	import ChoiceMulti from './ChoiceMulti.svelte';

	let { value = $bindable([]), ...props }: WeekdayChoiceMultiProps = $props();

	const items = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const longLabels = {
		Mon: 'Monday',
		Tue: 'Tuesday',
		Wed: 'Wednesday',
		Thu: 'Thursday',
		Fri: 'Friday',
		Sat: 'Saturday',
		Sun: 'Sunday'
	};
	const shortLabels = {
		Mon: 'M',
		Tue: 'T',
		Wed: 'W',
		Thu: 'T',
		Fri: 'F',
		Sat: 'S',
		Sun: 'S'
	};
	let getKey = (item: string) => item;
	let getLabel = (item: string) => {
		if (props.longLabels) return longLabels[item as keyof typeof longLabels];
		if (props.shortLabels) return shortLabels[item as keyof typeof shortLabels];
		return item;
	};
</script>

<ChoiceMulti {items} bind:value {getLabel} {getKey} {...props} />
