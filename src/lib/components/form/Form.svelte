<!-- <script lang="ts" generics="S extends type.Any<Record<string, unknown>>">
	import { toast } from 'svelte-sonner';
	import { dateTransport } from '$lib/utils/index.js';
	import { type } from 'arktype';
	import type { Snippet } from 'svelte';
	import type { Readable } from 'svelte/store';
	import { defaults, superForm, type SuperForm, type SuperValidated } from 'sveltekit-superforms';
	import { arktype, arktypeClient } from 'sveltekit-superforms/adapters';
	import type { SuperFormData, SuperFormErrors } from 'sveltekit-superforms/client';

	interface Props {
		validated?: SuperValidated<S['infer']> | S['infer'];
		schema: S;
		onSuccess?: (
			form: Readonly<SuperValidated<S['infer'], App.Superforms.Message, S['infer']>>
		) => void;
		invalidateAll?: boolean;
		children: Snippet<
			[
				{
					form: SuperForm<S['infer'], App.Superforms.Message>;
					data: SuperFormData<S['infer']>;
					delayed: Readable<boolean>;
					errors: SuperFormErrors<S['infer']>;
				}
			]
		>;
		// TODO: Enforce use of resolve
		action: string;
		actionName?: string;
		class?: string;
	}

	let {
		validated: _validated,
		schema,
		onSuccess,
		invalidateAll = false,
		children,
		action: _action,
		actionName,
		class: className
	}: Props = $props();

	let validated = _validated ?? defaults(arktype(schema));
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
	const { form: data, delayed, errors } = form;
</script>

<form class={className} action="{_action}?/{actionName}" method="POST" use:form.enhance>
	{@render children({ form, data, delayed, errors })}
</form> -->
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
</script>

<form class={className} action="{_action}?/{actionName}" method="POST" use:form.enhance>
	{@render children?.()}
</form>
