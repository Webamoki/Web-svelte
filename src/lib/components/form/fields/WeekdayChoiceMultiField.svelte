<script generics="T extends Record<string, unknown>, U extends FormPath<T>, M" lang="ts">
	import type { WeekdayChoiceMultiProps } from '$lib/components/ui/choice/WeekdayChoiceMulti.svelte';
	import type { FormPath } from 'sveltekit-superforms';

	import WeekdayChoiceMulti from '$lib/components/ui/choice/WeekdayChoiceMulti.svelte';

	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

	type Props = FieldWrapperProps<T, U, M> & WeekdayChoiceMultiProps & { class?: string };
	let {
		class: className,
		description,
		disabled,
		form,
		label,
		letterLabels,

		longLabels,
		name,
		onAdd,
		onRemove,
		readonly,
		value = $bindable([]),
		vertical
	}: Props = $props();
</script>

<FieldWrapper {name} class={className} {description} {form} {label}>
	{#snippet formElem(props)}
		<WeekdayChoiceMulti
			{disabled}
			{letterLabels}
			{longLabels}
			{onAdd}
			{onRemove}
			{readonly}
			{vertical}
			{...props}
			bind:value
		/>
	{/snippet}
</FieldWrapper>
