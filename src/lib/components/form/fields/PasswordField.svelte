<script generics="T extends Record<string, unknown>, U extends FormPath<T>, M" lang="ts">
	import type { Component } from 'svelte';
	import type { FormPath } from 'sveltekit-superforms';

	import IconInputWrapper from '$lib/components/form/IconInputWrapper.svelte';
	import { Input } from '$lib/shadcn/components/ui/input/index.js';
	import { cn } from '$lib/shadcn/utils.js';
	import { Eye, EyeOff } from '@lucide/svelte';

	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

	interface Props extends FieldWrapperProps<T, U, M> {
		class?: string;
		icon?: Component;
		value?: string;
	}
	let { class: className, icon, value = $bindable(), ...fieldProps }: Props = $props();

	let show = $state(false);
	let inputType = $derived(show ? 'text' : 'password');
</script>

<FieldWrapper {...fieldProps}>
	{#snippet formElem(props)}
		<div class="flex w-full items-stretch gap-2">
			<!-- Input itself with optional left icon -->
			<IconInputWrapper flex {icon}>
				{#snippet children({ class: iconClass })}
					<Input class={cn(iconClass, className)} type={inputType} bind:value {...props} />
				{/snippet}
			</IconInputWrapper>

			<!-- Show/hide button outside input -->
			<button
				class="flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-300 px-4 text-gray-500 transition-all hover:bg-gray-50 focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none"
				aria-label={show ? 'Hide password' : 'Show password'}
				onclick={() => (show = !show)}
				type="button"
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
