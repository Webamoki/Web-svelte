<script lang="ts" module>
	export interface WeekdayChoiceProps {
		class?: string;
		disabled?: boolean | null;
		letterLabels?: boolean;
		longLabels?: boolean;
		onChange?: (value: Day) => void;
		readonly?: boolean | null;
		value?: Day;
		vertical?: boolean;
	}
</script>

<script lang="ts">
	import type { Day } from '$lib/utils/types/arktype.js';

	import { Days, formatDayLetter, formatDayShort } from '$lib/utils/datetime/index.js';
	import { identity } from 'ramda';

	import Choice from './Choice.svelte';

	let { value = $bindable(undefined), ...props }: WeekdayChoiceProps = $props();

	let getLabel = $derived.by(() => {
		if (props.longLabels) return identity;
		if (props.letterLabels) return formatDayLetter;
		return formatDayShort;
	});
</script>

<Choice getKey={identity} {getLabel} getValue={identity} items={Days} bind:value {...props} />
