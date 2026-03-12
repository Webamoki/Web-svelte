<script lang="ts" module>
  import { identity } from 'ramda';

  export interface WeekdayChoiceMultiProps {
    class?: string;
    disabled?: boolean | null;
    letterLabels?: boolean;
    longLabels?: boolean;
    onAdd?: (value: Day) => void;
    onRemove?: (value: Day) => void;
    readonly?: boolean | null;
    value: Day[];
    vertical?: boolean;
  }
</script>

<script lang="ts">
  import type { Day } from '$lib/utils/types/arktype.js';

  import { Days, formatDayLetter, formatDayShort } from '$lib/utils/datetime/index.js';

  import ChoiceMulti from './ChoiceMulti.svelte';

  let { value = $bindable([]), ...props }: WeekdayChoiceMultiProps = $props();

  let getLabel = $derived.by(() => {
    if (props.longLabels) return identity;
    if (props.letterLabels) return formatDayLetter;
    return formatDayShort;
  });
</script>

<ChoiceMulti getKey={identity} {getLabel} getValue={identity} items={Days} bind:value {...props} />
