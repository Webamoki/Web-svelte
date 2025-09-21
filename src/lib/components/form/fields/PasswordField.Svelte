<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>, M">
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';
	import Input from '../Input.svelte';

	interface Props extends FieldWrapperProps<T, U, M> {
		value?: string;
	}
	let { value = $bindable(), ...fieldProps }: Props = $props();

	let show = $state(false);
	let inputType = $state('password');

	$effect(() => {
		inputType = show ? 'text' : 'password';
	});
</script>

<FieldWrapper {...fieldProps}>
	{#snippet formElem(props)}
		<div class="flex w-full items-center gap-2">
			<!-- Input itself -->
			<Input
				type={inputType}
				bind:value
				{...props}
				class="flex-1 rounded-md border px-3 py-2 text-sm transition-all duration-150 outline-none
				 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
			/>

			<!-- Show/hide button outside input -->
			<button
				type="button"
				class="flex cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-gray-500"
				onclick={() => (show = !show)}
				aria-label={show ? 'Hide password' : 'Show password'}
			>
				{#if show}
					<!-- Eye-off icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3-11-7 1.066-2.013 2.648-3.724 4.634-4.855m3.86-1.025A9.97 9.97 0 0112 5c5 0 9.27 3 11 7-1.054 2.01-2.633 3.72-4.615 4.852M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
						<path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18" />
					</svg>
				{:else}
					<!-- Eye icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
						/>
					</svg>
				{/if}
			</button>
		</div>
	{/snippet}
</FieldWrapper>
