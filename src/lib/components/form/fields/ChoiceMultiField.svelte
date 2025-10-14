<script
	lang="ts"
	generics="V, K extends string | number | symbol,T extends Record<string, unknown>, U extends FormPath<T>, M"
>
	import ChoiceMulti, { type ChoiceMultiProps } from '$lib/components/ui/choice/ChoiceMulti.svelte';
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

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
		description,
		disabled,
		readonly,
		buttonContent
	}: Props = $props();
</script>

<FieldWrapper {form} {name} {label} {description}>
	{#snippet formElem(props)}
		<div class="flex w-full items-center gap-2">
			<ChoiceMulti
				{items}
				{getKey}
				{getLabel}
				{onAdd}
				{onRemove}
				{buttonContent}
				{disabled}
				{readonly}
				{vertical}
				{...props}
				bind:value
			/>
		</div>
	{/snippet}
</FieldWrapper>
