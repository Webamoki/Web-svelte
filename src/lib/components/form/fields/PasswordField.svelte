<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>, M">
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';
	import { Input } from '$lib/shadcn/components/ui/input/index.js';
	import { Eye, EyeOff } from '@lucide/svelte';

	interface Props extends FieldWrapperProps<T, U, M> {
		value?: string;
	}
	let { value = $bindable(), ...fieldProps }: Props = $props();

	let show = $state(false);
	let inputType = $derived(show ? 'text' : 'password');
</script>

<FieldWrapper {...fieldProps}>
	{#snippet formElem(props)}
		<div class="flex w-full items-stretch gap-2">
			<!-- Input itself -->
			<Input type={inputType} bind:value {...props} />

			<!-- Show/hide button outside input -->
			<button
				type="button"
				class="flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-300 px-4 text-gray-500 transition-all hover:bg-gray-50 focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none"
				onclick={() => (show = !show)}
				aria-label={show ? 'Hide password' : 'Show password'}
			>
				{#if show}
					<EyeOff class="size-5" />
				{:else}
					<Eye class="size-5" />
				{/if}
			</button>
		</div>
	{/snippet}
</FieldWrapper>
