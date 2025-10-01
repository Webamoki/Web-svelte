<script lang="ts" generics="S extends type.Any<Record<string, unknown>>">
	import { toast } from 'svelte-sonner';
	import { dateTransport } from '$lib/utils/index.js';
	import { type } from 'arktype';
	import type { Snippet } from 'svelte';
	import { superForm, type SuperForm, type SuperValidated } from 'sveltekit-superforms';
	import { arktypeClient } from 'sveltekit-superforms/adapters';
	import type { SuperFormData } from 'sveltekit-superforms/client';

	interface Props {
		validated: SuperValidated<S['infer']> | S['infer'];
		schema: S;
		onSuccess?: (
			form: Readonly<SuperValidated<S['infer'], App.Superforms.Message, S['infer']>>
		) => void;
		invalidateAll?: boolean;
		children: Snippet<
			[{ form: SuperForm<S['infer'], App.Superforms.Message>; data: SuperFormData<S['infer']> }]
		>;
		// TODO: Enforce use of resolve
		action: string;
		actionName: string;
		class: string;
	}

	let {
		validated,
		schema,
		onSuccess,
		invalidateAll = false,
		children,
		action: _action,
		actionName,
		class: className
	}: Props = $props();

	const form = superForm(validated, {
		validators: arktypeClient(schema),
		dataType: 'json',
		invalidateAll,
		transport: dateTransport,
		onUpdated({ form }) {
			const text = form.message?.text;
			if (text === undefined) return;

			if (form.message?.success) {
				toast.success(text);
			} else {
				toast.error(text);
			}

			if (form.valid) {
				onSuccess?.(form);
			}
		}
	});
	const data = form.form;
</script>

<form class={className} action="{_action}?/{actionName}" method="POST" use:form.enhance>
	{@render children({ form, data })}
</form>
