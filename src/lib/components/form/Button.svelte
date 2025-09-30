<script lang="ts">
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import { Button } from '$lib/shadcn/components/ui/button/index.js';
	import type { ButtonProps } from '$lib/shadcn/components/ui/button/index.js';
	import type { Readable } from 'svelte/store';

	type Props = ButtonProps & {
		loading?: boolean;
		delayed?: Readable<boolean>;
	};

	let { disabled, loading, delayed, children, ...restProps }: Props = $props();
</script>

<Button disabled={disabled || loading || $delayed} {...restProps}>
	{#if loading || $delayed}
		<Loader2Icon class="mr-2 animate-spin" />
		Please wait
	{:else}
		{@render children?.()}
	{/if}
</Button>
