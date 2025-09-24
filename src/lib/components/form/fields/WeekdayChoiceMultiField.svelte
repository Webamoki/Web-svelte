<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>, M">
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';
	import type { WeekdayChoiceMultiProps } from '$lib/components/ui/choice/WeekdayChoiceMulti.svelte';
	import WeekdayChoiceMulti from '$lib/components/ui/choice/WeekdayChoiceMulti.svelte';

	type Props = FieldWrapperProps<T, U, M> & WeekdayChoiceMultiProps;
	let {
		onAdd,
		onRemove,
		vertical,
		value = $bindable([]),
		letterLabels,
		longLabels,

		form,
		name,
		label,
		description,
		disabled,
		readonly
	}: Props = $props();
</script>

<FieldWrapper {form} {name} {label} {description}>
	{#snippet formElem(props)}
		<div class="flex w-full items-center gap-2">
			<WeekdayChoiceMulti
				{onAdd}
				{onRemove}
				{disabled}
				{readonly}
				{vertical}
				{letterLabels}
				{longLabels}
				{...props}
				bind:value
			/>
		</div>
	{/snippet}
</FieldWrapper>
