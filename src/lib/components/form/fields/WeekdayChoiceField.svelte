<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>, M">
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';
	import WeekdayChoice, {
		type WeekdayChoiceProps
	} from '$lib/components/ui/choice/WeekdayChoice.svelte';

	type Props = FieldWrapperProps<T, U, M> & WeekdayChoiceProps;

	let {
		onChange,
		vertical,
		value = $bindable(undefined),
		shortLabels,
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
			<WeekdayChoice
				{onChange}
				{vertical}
				{disabled}
				{readonly}
				{shortLabels}
				{longLabels}
				bind:value
				{...props}
			/>
		</div>
	{/snippet}
</FieldWrapper>
