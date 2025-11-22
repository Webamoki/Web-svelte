<script lang="ts" generics="T extends Record<string, unknown>, M">
	import type { FsSuperForm } from 'formsnap';
	import type { Snippet } from 'svelte';

	interface Props {
		form: FsSuperForm<T, M>;
		action: string;
		actionName?: string;
		class?: string;
		children?: Snippet;
	}

	let { form, action: _action, actionName, class: className, children }: Props = $props();
	actionName = actionName ? `?/${actionName}` : '';
</script>

<form class={className} action="{_action}{actionName}" method="POST" use:form.enhance>
	{@render children?.()}
</form>
