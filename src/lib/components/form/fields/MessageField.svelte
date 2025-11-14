<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>, M">
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';
	import { Textarea } from '$lib/shadcn/components/ui/textarea/index.js';
	import { Lock, LockOpen } from '@lucide/svelte';

	interface Props extends FieldWrapperProps<T, U, M> {
		value?: string;
		class?: string;
		placeholder?: string;
		defaultHeight?: number;
		showLock?: boolean;
		defaultLocked?: boolean;
	}
	let {
		value = $bindable(),
		class: className,
		placeholder,
		defaultHeight = 100,
		showLock = true,
		defaultLocked = false,
		...fieldProps
	}: Props = $props();

	let locked = $state(defaultLocked);
</script>

<FieldWrapper {...fieldProps}>
	{#snippet formElem(props)}
		<div class="flex w-full items-start gap-2">
			<!-- Textarea itself -->
			<Textarea
				bind:value
				class={`${className || ''} ${locked ? 'resize-none' : 'resize-y'}`}
				{placeholder}
				style={defaultHeight ? `height: ${defaultHeight}px` : undefined}
				{...props}
			/>

			<!-- Lock/unlock button -->
			{#if showLock}
				<button
					type="button"
					class="flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-300 px-4 py-3 text-gray-500 transition-all hover:bg-gray-50 focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none"
					onclick={() => (locked = !locked)}
					aria-label={locked ? 'Unlock height' : 'Lock height'}
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
