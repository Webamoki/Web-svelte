<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>, M">
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';
	import { Input } from '$lib/shadcn/components/ui/input/index.js';

	interface Props extends FieldWrapperProps<T, U, M> {
		value?: string;
		type?: HTMLInputElement['type'];
	}
	let { value = $bindable(), ...fieldProps }: Props = $props();
</script>

<FieldWrapper {...fieldProps}>
	{#snippet formElem(props)}
		<Input type={fieldProps.type ?? 'text'} bind:value {...props} />
	{/snippet}
</FieldWrapper>
