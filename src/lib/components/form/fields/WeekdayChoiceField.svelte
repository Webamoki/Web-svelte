<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>, M">
	import WeekdayChoice, {
		type WeekdayChoiceProps
	} from '$lib/components/ui/choice/WeekdayChoice.svelte';
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

	type Props = { class?: string } & FieldWrapperProps<T, U, M> & WeekdayChoiceProps;

	let {
		onChange,
		vertical,
		value = $bindable(undefined),
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
		<WeekdayChoice
			{onChange}
			{vertical}
			{disabled}
			{readonly}
			{letterLabels}
			{longLabels}
			bind:value
			{...props}
			class="w-full"
		/>
	{/snippet}
</FieldWrapper>
