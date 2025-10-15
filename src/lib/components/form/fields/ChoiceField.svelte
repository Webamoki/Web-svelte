<script
	lang="ts"
	generics="V,I, K extends string | number | symbol,T extends Record<string, unknown>, U extends FormPath<T>, M"
>
	import Choice, { type ChoiceProps } from '$lib/components/ui/choice/Choice.svelte';
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

	type Props = {
		class?: string;
	} & FieldWrapperProps<T, U, M> &
		ChoiceProps<V, I, K>;

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
		buttonContent,
		class: className
	}: Props = $props();
</script>

<FieldWrapper {form} {name} {label} {description} class={className}>
	{#snippet formElem(props)}
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
			class="w-full"
		/>
	{/snippet}
</FieldWrapper>
