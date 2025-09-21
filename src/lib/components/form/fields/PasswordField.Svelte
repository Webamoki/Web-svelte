<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>, M">
	import type { FormPath } from 'sveltekit-superforms';
	import { type FieldWrapperProps } from '../FieldWrapper.svelte';
	import InputField from '../InputField.svelte';

	interface Props extends FieldWrapperProps<T, U, M> {
		value?: string;
	}
	let { value = $bindable(), ...fieldProps }: Props = $props();
</script>

<InputField {...fieldProps} bind:value type="password" />
