<script generics="T extends Record<string, unknown>, U extends FormPath<T>, M" lang="ts">
	import type { Component } from 'svelte';
	import type { FormPath } from 'sveltekit-superforms';

	import IconInputWrapper from '$lib/components/form/IconInputWrapper.svelte';
	import { Textarea } from '$lib/shadcn/components/ui/textarea/index.js';
	import { cn } from '$lib/shadcn/utils.js';
	import { Lock, LockOpen } from '@lucide/svelte';

	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

	interface Props extends FieldWrapperProps<T, U, M> {
		class?: string;
		defaultHeight?: number;
		defaultLocked?: boolean;
		icon?: Component;
		placeholder?: string;
		showLock?: boolean;
		value?: string;
	}
	let {
		class: className,
		defaultHeight = 100,
		defaultLocked = false,
		icon,
		placeholder,
		showLock = true,
		value = $bindable(),
		...fieldProps
	}: Props = $props();

	let locked = $state(defaultLocked);
</script>

<FieldWrapper {...fieldProps}>
	{#snippet formElem(props)}
		<div class="flex w-full items-start gap-2">
			<!-- Textarea itself with optional left icon -->
			<IconInputWrapper flex {icon} iconPosition="top">
				{#snippet children({ class: iconClass })}
					<Textarea
						style={defaultHeight ? `height: ${defaultHeight}px` : undefined}
						class={cn(iconClass, className || '', locked ? 'resize-none' : 'resize-y')}
						{placeholder}
						bind:value
						{...props}
					/>
				{/snippet}
			</IconInputWrapper>

			<!-- Lock/unlock button -->
			{#if showLock}
				<button
					class="flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-300 px-4 py-3 text-gray-500 transition-all hover:bg-gray-50 focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none"
					aria-label={locked ? 'Unlock height' : 'Lock height'}
					onclick={() => (locked = !locked)}
					type="button"
				>
					{#if locked}
						<Lock class="size-5" />
					{:else}
						<LockOpen class="size-5" />
					{/if}
				</button>
			{/if}
		</div>
	{/snippet}
</FieldWrapper>
