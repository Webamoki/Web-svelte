<script lang="ts" module>
	export interface ChoiceInternalProps<V, I, K extends string | number | symbol>
		extends Partial<FormAttrs> {
		items: readonly I[];
		getKey: (item: I) => K;
		getLabel: (item: I) => string;
		getValue: (item: I) => V;
		vertical?: boolean;
		buttonContent?: Snippet<[label: string]>;
	}
</script>

<script lang="ts" generics="V, I, K extends string | number | symbol">
	import type { FormAttrs } from '$lib/components/form/FieldWrapper.svelte';
	import { cn } from '$lib/shadcn/utils.js';
	import type { Snippet } from 'svelte';

	interface Props extends ChoiceInternalProps<V, I, K> {
		handleItemClick: (item: I) => void;
		isActive: (item: I) => boolean;
	}

	let {
		items = [],
		getKey,
		getLabel,
		vertical,
		handleItemClick,
		isActive,
		disabled,
		readonly,
		'aria-invalid': ariaInvalid,
		buttonContent,
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
		ariaInvalid && 'border-destructive'
	)}
>
	{#each items as item (getKey(item))}
		<button
			type="button"
			onclick={() => {
				if (disabled || readonly) return;
				handleItemClick(item);
			}}
			data-state={isActive(item) ? 'active' : 'inactive'}
			class="h-8 cursor-pointer rounded-lg bg-transparent p-2 text-muted-foreground hover:text-foreground hover:outline-2 focus-visible:outline-ring data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
		>
			{#if buttonContent}
				{@render buttonContent(getLabel(item))}
			{:else}
				{getLabel(item)}
			{/if}
		</button>
	{/each}
</div>
