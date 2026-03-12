<script lang="ts">
	import { Choice, ChoiceMulti } from '$lib/components/ui/index.js';
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
		<Choice
			getKey={identity}
			getLabel={identity}
			getValue={identity}
			{items}
			bind:value={valueOne}
		/>
	</div>

	<div>
		Multiple: {valueMultiple}
		<ChoiceMulti
			getKey={identity}
			getLabel={identity}
			getValue={identity}
			{items}
			bind:value={valueMultiple}
		/>
	</div>

	<div>
		Single Vertical: {valueOneV}
		<Choice
			getKey={identity}
			getLabel={identity}
			getValue={identity}
			{items}
			vertical
			bind:value={valueOneV}
		/>
	</div>

	<div>
		Multiple Vertical: {valueMultipleV}
		<ChoiceMulti
			getKey={identity}
			getLabel={identity}
			getValue={identity}
			{items}
			vertical
			bind:value={valueMultipleV}
		/>
	</div>
</div>
