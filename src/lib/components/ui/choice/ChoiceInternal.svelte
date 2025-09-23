<script lang="ts" module>
	export interface ChoiceProps<T, K extends string | number | symbol> {
		items: readonly T[];
		getKey: (item: T) => K;
		getLabel: (item: T) => string;
		vertical?: boolean;
	}
</script>

<script lang="ts" generics="T, K extends string | number | symbol">
	import { cn } from '$lib/shadcn/utils.js';

	interface Props extends ChoiceProps<T, K> {
		handleItemClick: (item: T) => void;
		isActive: (item: T) => boolean;
	}

	let { items = [], getKey, getLabel, vertical, handleItemClick, isActive }: Props = $props();
</script>

<div
	class={cn(
		'w-fit rounded-lg border border-border bg-muted p-1 text-sm leading-[0.01em] font-semibold shadow-inner',
		'grid gap-1',
		vertical ? 'grid-flow-row auto-rows-fr' : 'auto-cols-fr grid-flow-col'
	)}
>
	{#each items as item (getKey(item))}
		<button
			onclick={() => handleItemClick(item)}
			data-state={isActive(item) ? 'active' : 'inactive'}
			class="h-8 cursor-pointer rounded-lg bg-transparent p-2 text-muted-foreground hover:text-foreground hover:outline-2 focus-visible:outline-ring data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
			>{getLabel(item)}</button
		>
	{/each}
</div>
