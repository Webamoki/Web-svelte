<script lang="ts">
	import { cn } from '$lib/shadcn/utils.js';
	import { FieldErrors } from 'formsnap';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<FieldErrors>
	{#snippet children({ errors, errorProps })}
		<div class={cn('space-y-1', className)}>
			{#each errors as error (error)}
				<span class="text-red-600" {...errorProps}>{error}</span>
			{/each}
		</div>
	{/snippet}
</FieldErrors>
