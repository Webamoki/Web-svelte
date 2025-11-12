<script lang="ts" module>
	import { identity } from 'ramda';

	export interface WeekdayChoiceMultiProps {
		value: Day[];
		onAdd?: (value: Day) => void;
		onRemove?: (value: Day) => void;
		vertical?: boolean;
		longLabels?: boolean;
		letterLabels?: boolean;
		disabled?: boolean | null;
		readonly?: boolean | null;
		class?: string;
	}
</script>

<script lang="ts">
	import ChoiceMulti from './ChoiceMulti.svelte';
	import { Days, formatDayLetter, formatDayShort } from '$lib/utils/datetime/index.js';
	import type { Day } from '$lib/utils/types/arktype.js';

	let { value = $bindable([]), ...props }: WeekdayChoiceMultiProps = $props();

	let getLabel = $derived.by(() => {
		if (props.longLabels) return identity;
		if (props.letterLabels) return formatDayLetter;
		return formatDayShort;
	});
</script>

<ChoiceMulti items={Days} bind:value {getLabel} getKey={identity} getValue={identity} {...props} />
