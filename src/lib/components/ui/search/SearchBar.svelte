<script lang="ts">
	import Input from '$lib/shadcn/components/ui/input/input.svelte';
	import { cn } from '$lib/shadcn/utils.js';
	import { Search } from '@lucide/svelte';

	interface Props {
		defaultValue?: string;
		placeholder?: string;
		onChange: (value: string) => void;
		class?: string;
	}
	let { defaultValue, placeholder, onChange, class: className }: Props = $props();
</script>

<div class="relative w-full max-w-sm">
	<Search class="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
	<Input
		type="search"
		{placeholder}
		value={defaultValue}
		oninput={(e: Event & { currentTarget: HTMLInputElement }) => onChange(e.currentTarget.value)}
		class={cn('w-full pl-9', className)}
	/>
</div>
