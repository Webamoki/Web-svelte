<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>, M">
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';
	import ColorPicker from 'svelte-awesome-color-picker';
	interface Props extends FieldWrapperProps<T, U, M> {
		value?: string;
	}
	let { value = $bindable(), ...fieldProps }: Props = $props();
</script>

<FieldWrapper {...fieldProps}>
	{#snippet formElem()}
		<ColorPicker bind:hex={value} label={value} isAlpha={false} position="responsive" />
	{/snippet}
</FieldWrapper>
