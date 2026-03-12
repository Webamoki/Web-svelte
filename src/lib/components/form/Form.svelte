<script generics="T extends Record<string, unknown>, M" lang="ts">
	import type { FsSuperForm } from 'formsnap';
	import type { Snippet } from 'svelte';

	interface Props {
		action: string;
		actionName?: string;
		children?: Snippet;
		class?: string;
		form: FsSuperForm<T, M>;
	}

	let { action: _action, actionName, children, class: className, form }: Props = $props();
	actionName = actionName ? `?/${actionName}` : '';
</script>

<form class={className} action="{_action}{actionName}" method="POST" use:form.enhance>
	{@render children?.()}
</form>
