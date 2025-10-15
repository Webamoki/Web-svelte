<script
	lang="ts"
	generics="V,I, K extends string | number | symbol,T extends Record<string, unknown>, U extends FormPath<T>, M"
>
	import ChoiceMulti, { type ChoiceMultiProps } from '$lib/components/ui/choice/ChoiceMulti.svelte';
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

	type Props = { class?: string } & FieldWrapperProps<T, U, M> & ChoiceMultiProps<V, I, K>;
	let {
		items,
		getKey,
		getLabel,
		getValue,
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
		buttonContent,
		class: className
	}: Props = $props();
</script>

<FieldWrapper {form} {name} {label} {description} class={className}>
	{#snippet formElem(props)}
		<ChoiceMulti
			{items}
			{getKey}
			{getLabel}
			{getValue}
			{onAdd}
			{onRemove}
			{buttonContent}
			{disabled}
			{readonly}
			{vertical}
			{...props}
			bind:value
			class="w-full"
		/>
	{/snippet}
</FieldWrapper>
