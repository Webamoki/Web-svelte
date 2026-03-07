<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>, M">
	import IconInputWrapper from '$lib/components/form/IconInputWrapper.svelte';
	import { Input } from '$lib/shadcn/components/ui/input/index.js';
	import { cn } from '$lib/shadcn/utils.js';
	import { Eye, EyeOff } from '@lucide/svelte';
	import type { Component } from 'svelte';
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

	interface Props extends FieldWrapperProps<T, U, M> {
		value?: string;
		class?: string;
		icon?: Component;
	}
	let { value = $bindable(), class: className, icon, ...fieldProps }: Props = $props();

	let show = $state(false);
	let inputType = $derived(show ? 'text' : 'password');
</script>

<FieldWrapper {...fieldProps}>
	{#snippet formElem(props)}
		<div class="flex w-full items-stretch gap-2">
			<!-- Input itself with optional left icon -->
			<IconInputWrapper {icon} flex>
				{#snippet children({ class: iconClass })}
					<Input type={inputType} bind:value class={cn(iconClass, className)} {...props} />
				{/snippet}
			</IconInputWrapper>

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
