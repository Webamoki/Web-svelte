<script
	lang="ts"
	generics="V,I, K extends string | number | symbol,T extends Record<string, unknown>, U extends FormPath<T>, M"
>
	import Choice, { type ChoiceProps } from '$lib/components/ui/choice/Choice.svelte';
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

	type Props = FieldWrapperProps<T, U, M> & ChoiceProps<V, I, K>;

	let {
		items,
		getKey,
		getLabel,
		getValue,
		onChange,
		vertical,
		value = $bindable(undefined),

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
			<Choice
				{items}
				{getKey}
				{getLabel}
				{getValue}
				{onChange}
				{buttonContent}
				{vertical}
				{disabled}
				{readonly}
				bind:value
				{...props}
			/>
		</div>
	{/snippet}
</FieldWrapper>
