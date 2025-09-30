<script lang="ts">
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import { Button } from '$lib/shadcn/components/ui/button/index.js';
	import type { ButtonProps } from '$lib/shadcn/components/ui/button/index.js';

	type Props = ButtonProps & {
		loading?: boolean;
	};

	let { disabled, loading, children, ...restProps }: Props = $props();
</script>

<Button disabled={disabled || loading} {...restProps}>
	{#if loading}
		<Loader2Icon class="mr-2 animate-spin" />
		Please wait
	{:else}
		{@render children?.()}
	{/if}
</Button>
