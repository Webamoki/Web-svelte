<script
	lang="ts"
	generics="V, K extends string | number | symbol,T extends Record<string, unknown>, U extends FormPath<T>, M"
>
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';
	import Choice, { type ChoiceProps } from '$lib/components/ui/choice/Choice.svelte';

	type Props = FieldWrapperProps<T, U, M> & ChoiceProps<V, K>;

	let {
		items,
		getKey,
		getLabel,
		onChange,
		vertical,
		value = $bindable(undefined),

		form,
		name,
		label,
		description
	}: Props = $props();
</script>

<FieldWrapper {form} {name} {label} {description}>
	{#snippet formElem(props)}
		<div class="flex w-full items-center gap-2">
			<Choice {items} {getKey} {getLabel} {onChange} {vertical} bind:value {...props} />
		</div>
	{/snippet}
</FieldWrapper>
