<script lang="ts" module>
	export interface WeekdayChoiceProps {
		value?: Day;
		onChange?: (value: Day) => void;
		vertical?: boolean;
		longLabels?: boolean;
		letterLabels?: boolean;
		disabled?: boolean | null;
		readonly?: boolean | null;
		class?: string;
	}
</script>

<script lang="ts">
	import { Days, formatDayLetter, formatDayShort } from '$lib/utils/datetime/index.js';
	import { identity } from 'ramda';

	import Choice from './Choice.svelte';
	import type { Day } from '$lib/utils/types/arktype.js';

	let { value = $bindable(undefined), ...props }: WeekdayChoiceProps = $props();

	let getLabel = $derived.by(() => {
		if (props.longLabels) return identity;
		if (props.letterLabels) return formatDayLetter;
		return formatDayShort;
	});
</script>

<Choice items={Days} bind:value {getLabel} getValue={identity} getKey={identity} {...props} />
