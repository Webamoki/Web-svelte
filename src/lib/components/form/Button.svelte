<script lang="ts">
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import { Button } from '$lib/shadcn/components/ui/button/index.js';
	import type { ButtonProps } from '$lib/shadcn/components/ui/button/index.js';

	type Props = ButtonProps & {
		loading?: boolean;
		class?: string;
		loadingMessage?: string;
	};

	let {
		disabled,
		loading,
		children,
		loadingMessage = 'Please wait',
		class: className,
		...restProps
	}: Props = $props();
</script>

<Button disabled={disabled || loading} class={className} {...restProps}>
	{#if loading}
		<Loader2Icon class="mr-2 animate-spin" />
		{loadingMessage}
	{:else}
		{@render children?.()}
	{/if}
</Button>
