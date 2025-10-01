<script lang="ts" generics="V,T extends Record<string, unknown>, U extends FormPath<T>, M">
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';
	import { Input } from '$lib/shadcn/components/ui/input/index.js';

	interface Props extends FieldWrapperProps<T, U, M> {
		value?: V;
		class?: string;
		step?: HTMLInputElement['step'];
	}
	let { value = $bindable(), class: className, step, ...fieldProps }: Props = $props();
</script>

<FieldWrapper {...fieldProps}>
	{#snippet formElem(props)}
		<Input type="number" bind:value class={className} {step} {...props} />
	{/snippet}
</FieldWrapper>
