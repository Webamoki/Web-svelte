<script lang="ts" module>
	export interface FieldWrapperProps<T extends Record<string, unknown>, U extends FormPath<T>, M> {
		form: FsSuperForm<T, M>;
		name: U;
		label?: string;
		description?: string;
	}

	export interface FormAttrs extends ControlAttrs {
		disabled?: HTMLInputAttributes['disabled'];
		readonly?: HTMLInputAttributes['readonly'];
	}
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>, M">
	import {
		Control,
		Description,
		Field,
		Label,
		type ControlAttrs,
		type FsSuperForm
	} from 'formsnap';
	import type { Snippet } from 'svelte';
	import type { FormPath } from 'sveltekit-superforms';
	import Errors from './Errors.svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends FieldWrapperProps<T, U, M> {
		formElem: Snippet<[ControlAttrs]>;
	}
	let { form, name, label, description, formElem }: Props = $props();
</script>

<Field {form} {name}>
	<div class="space-y-1">
		<Control>
			{#snippet children({ props })}
				<div class="space-y-1">
					{#if label || description}
						<div>
							{#if label}
								<Label class="text-sm font-medium">{label}</Label>
							{/if}
							{#if description}
								<Description class="text-sm font-medium">{description}</Description>
							{/if}
						</div>
					{/if}
					{@render formElem(props)}
				</div>
			{/snippet}
		</Control>

		<Errors />
	</div>
</Field>
