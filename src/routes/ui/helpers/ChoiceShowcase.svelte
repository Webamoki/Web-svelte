<script lang="ts">
	import { Choice, ChoiceMultiple } from '$lib/components/index.js';
	import { identity } from 'ramda';

	const items: string[] = ['item1', 'item2', 'item3', 'item4', 'item5'];

	let valueOne: string | undefined = $state();
	let valueOneV: string | undefined = $state();
	let valueMultiple: string[] = $state([]);
	let valueMultipleV: string[] = $state([]);
</script>

<h1>Choice</h1>
<div class="grid grid-cols-2 gap-4 p-4">
	<div>
		Single: {valueOne}
		<Choice bind:value={valueOne} {items} getKey={identity} getLabel={identity} />
	</div>

	<div>
		Multiple: {valueMultiple}
		<ChoiceMultiple
			bind:value={valueMultiple}
			{items}
			getKey={identity}
			getLabel={identity}
			compareItems={(a, b) => a.localeCompare(b)}
		/>
	</div>

	<div>
		Single Vertical: {valueOneV}
		<Choice bind:value={valueOneV} {items} getKey={identity} getLabel={identity} vertical />
	</div>

	<div>
		Multiple Vertical: {valueMultipleV}
		<ChoiceMultiple
			bind:value={valueMultipleV}
			{items}
			getKey={identity}
			getLabel={identity}
			compareItems={(a, b) => a.localeCompare(b)}
			vertical
		/>
	</div>
</div>
