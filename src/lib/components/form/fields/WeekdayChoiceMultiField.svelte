<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>, M">
	import type { WeekdayChoiceMultiProps } from '$lib/components/ui/choice/WeekdayChoiceMulti.svelte';
	import WeekdayChoiceMulti from '$lib/components/ui/choice/WeekdayChoiceMulti.svelte';
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

	type Props = { class?: string } & FieldWrapperProps<T, U, M> & WeekdayChoiceMultiProps;
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
		readonly,
		class: className
	}: Props = $props();
</script>

<FieldWrapper {form} {name} {label} {description} class={className}>
	{#snippet formElem(props)}
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
	{/snippet}
</FieldWrapper>
