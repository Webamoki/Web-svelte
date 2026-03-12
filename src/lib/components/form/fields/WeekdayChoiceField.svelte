<script generics="T extends Record<string, unknown>, U extends FormPath<T>, M" lang="ts">
	import type { FormPath } from 'sveltekit-superforms';

	import WeekdayChoice, {
		type WeekdayChoiceProps
	} from '$lib/components/ui/choice/WeekdayChoice.svelte';

	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

	type Props = FieldWrapperProps<T, U, M> & WeekdayChoiceProps & { class?: string };

	let {
		class: className,
		description,
		disabled,
		form,
		label,

		letterLabels,
		longLabels,
		name,
		onChange,
		readonly,
		value = $bindable(undefined),
		vertical
	}: Props = $props();
</script>

<FieldWrapper {name} class={className} {description} {form} {label}>
	{#snippet formElem(props)}
		<WeekdayChoice
			{disabled}
			{letterLabels}
			{longLabels}
			{onChange}
			{readonly}
			{vertical}
			bind:value
			{...props}
			class="w-full"
		/>
	{/snippet}
</FieldWrapper>
