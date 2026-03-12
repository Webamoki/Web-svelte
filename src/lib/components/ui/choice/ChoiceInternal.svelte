<script lang="ts" module>
	export interface ChoiceInternalProps<
		V,
		I,
		K extends number | string | symbol
	> extends Partial<FormAttrs> {
		buttonContent?: Snippet<[label: string, item: I]>;
		class?: string;
		getKey: (item: I) => K;
		getLabel: (item: I) => string;
		getValue: (item: I) => V;
		items: readonly I[];
		vertical?: boolean;
	}
</script>

<script generics="V, I, K extends number | string | symbol" lang="ts">
	import type { FormAttrs } from '$lib/components/form/FieldWrapper.svelte';
	import type { Snippet } from 'svelte';

	import { cn } from '$lib/shadcn/utils.js';

	interface Props extends ChoiceInternalProps<V, I, K> {
		handleItemClick: (item: I) => void;
		isActive: (item: I) => boolean;
	}

	let {
		'aria-invalid': ariaInvalid,
		buttonContent,
		class: className,
		disabled,
		getKey,
		getLabel,
		handleItemClick,
		isActive,
		items = [],
		readonly,
		vertical,
		...control
	}: Props = $props();
</script>

<div
	{...control}
	class={cn(
		'w-fit rounded-lg border border-border bg-muted p-1 text-sm leading-[0.01em] font-semibold shadow-inner',
		'grid gap-1',
		vertical ? 'grid-flow-row auto-rows-fr' : 'auto-cols-fr grid-flow-col',
		disabled || readonly ? 'pointer-events-none' : 'cursor-pointer',
		disabled && 'opacity-50',
		ariaInvalid && 'border-destructive',
		className
	)}
>
	{#each items as item (getKey(item))}
		{#if buttonContent}
			<button
				class="cursor-pointer rounded-lg bg-transparent text-muted-foreground hover:text-foreground hover:outline-2 focus-visible:outline-ring data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
				data-state={isActive(item) ? 'active' : 'inactive'}
				onclick={() => {
					if (disabled || readonly) return;
					handleItemClick(item);
				}}
				type="button"
			>
				{@render buttonContent(getLabel(item), item)}
			</button>
		{:else}
			<button
				class="h-8 cursor-pointer rounded-lg bg-transparent p-2 text-muted-foreground hover:text-foreground hover:outline-2 focus-visible:outline-ring data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
				data-state={isActive(item) ? 'active' : 'inactive'}
				onclick={() => {
					if (disabled || readonly) return;
					handleItemClick(item);
				}}
				type="button"
			>
				{getLabel(item)}
			</button>
		{/if}
	{/each}
</div>
