<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>, M">
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';
	import Input from '../Input.svelte';

	interface Props extends FieldWrapperProps<T, U, M> {
		value?: string;
		type?: HTMLInputElement['type'];
	}
	let { value = $bindable(), ...fieldProps }: Props = $props();
</script>

<FieldWrapper {...fieldProps}>
	{#snippet formElem(props)}
		<Input type={fieldProps.type ?? 'text'} error bind:value {...props} />
	{/snippet}
</FieldWrapper>
