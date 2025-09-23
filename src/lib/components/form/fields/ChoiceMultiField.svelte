<script
	lang="ts"
	generics="V, K extends string | number | symbol,T extends Record<string, unknown>, U extends FormPath<T>, M"
>
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';
	import { Input } from '$lib/shadcn/components/ui/input/index.js';
	import ChoiceMultiple, {
		type ChoiceMultiProps
	} from '$lib/components/ui/choice/ChoiceMulti.svelte';

	type Props = FieldWrapperProps<T, U, M> & ChoiceMultiProps<V, K>;
	let {
		items,
		getKey,
		getLabel,
		onAdd,
		onRemove,
		vertical,
		value = $bindable([]),

		form,
		name,
		label,
		description
	}: Props = $props();
</script>

<FieldWrapper {form} {name} {label} {description}>
	{#snippet formElem(props)}
		<div class="flex w-full items-center gap-2">
			<ChoiceMultiple
				{items}
				{getKey}
				{getLabel}
				{onAdd}
				{onRemove}
				{vertical}
				{...props}
				bind:value
			/>
		</div>
	{/snippet}
</FieldWrapper>
