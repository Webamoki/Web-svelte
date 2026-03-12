<script generics="T extends Record<string, unknown>, M" lang="ts">
	import type { FsSuperForm } from 'formsnap';
	import type { Snippet } from 'svelte';

	interface Props {
		actionName?: string;
		actionPath: string;
		children?: Snippet;
		class?: string;
		form: FsSuperForm<T, M>;
	}

	let { actionName, actionPath, children, class: className, form }: Props = $props();
</script>

<form
	class={className}
	action="{actionPath ?? ''}{actionName ? `?/${actionName}` : ''}"
	method="POST"
	use:form.enhance
>
	{@render children?.()}
</form>
