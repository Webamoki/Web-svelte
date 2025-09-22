<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>, M">
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';
	import { Input } from '$lib/shadcn/components/ui/input/index.js';

	interface Props extends FieldWrapperProps<T, U, M> {
		value?: string;
		type?: HTMLInputElement['type'];
		class?: string;
		placeholder?: string;
	}
	let {
		value = $bindable(),
		type = 'text',
		class: className,
		placeholder,
		...fieldProps
	}: Props = $props();
</script>

<FieldWrapper {...fieldProps}>
	{#snippet formElem(props)}
		<Input {type} bind:value class={className} {placeholder} {...props} />
	{/snippet}
</FieldWrapper>
