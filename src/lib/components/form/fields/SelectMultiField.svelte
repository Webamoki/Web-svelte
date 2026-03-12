<script
	generics="I,V, K extends number | string,T extends Record<string, unknown>, U extends FormPath<T>, M"
	lang="ts"
>
	import type { Component } from 'svelte';
	import type { FormPath } from 'sveltekit-superforms';

	import IconInputWrapper from '$lib/components/form/IconInputWrapper.svelte';
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectLabel,
		SelectTrigger
	} from '$lib/shadcn/components/ui/select/index.js';
	import { cn } from '$lib/shadcn/utils.js';

	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

	interface Props extends FieldWrapperProps<T, U, M> {
		class?: string;
		getKey: (item: I) => K;
		getLabel: (item: I) => string;
		getValue: (item: I) => V;
		icon?: Component;
		items: readonly I[];
		onchange?: (value: V[]) => void;
		placeholder: string;
		values?: V[];
	}
	let {
		class: className,
		getKey: _getKey,
		getLabel,
		getValue,
		icon,
		items,
		onchange,
		placeholder,
		values = $bindable([]),
		...fieldProps
	}: Props = $props();
	// Items property shouldn't be updated, ignore warning
	// svelte-ignore state_referenced_locally
	let valueToItem: Map<V, I> = new Map(items.map((item) => [getValue(item), item] as const));
	// svelte-ignore state_referenced_locally
	let keyToItem: Map<string, I> = new Map(items.map((item) => [getKey(item), item] as const));

	// Enforce string key function
	function getKey(item: I) {
		const key = _getKey(item);
		return key.toString();
	}

	function getKeyFromValue(): string[] {
		return values.map((value) => {
			const item = valueToItem.get(value)!;
			return getKey(item)!;
		});
	}

	function setValueFromKey(keys: string[]) {
		const newValues: V[] = keys
			.map((key) => keyToItem.get(key))
			.filter((item): item is I => item !== undefined) // filter out missing keys
			.map((item) => getValue(item));
		values = newValues;
		onchange?.(newValues);
	}

	function getPreview() {
		return values.length
			? values.map((value) => getLabel(valueToItem.get(value)!)).join(', ')
			: placeholder;
	}
</script>

<FieldWrapper {...fieldProps}>
	{#snippet formElem(props)}
		<Select type="multiple" {...props} bind:value={getKeyFromValue, setValueFromKey}>
			<IconInputWrapper {icon}>
				{#snippet children({ class: iconClass })}
					<SelectTrigger class={cn('w-full cursor-pointer truncate', iconClass, className)}>
						<span class="block truncate">
							{getPreview()}
						</span>
					</SelectTrigger>
				{/snippet}
			</IconInputWrapper>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>{fieldProps.label}</SelectLabel>
					{#each items as item (getKey(item))}
						<SelectItem class="cursor-pointer" label={getLabel(item)} value={getKey(item)} />
					{/each}
				</SelectGroup>
			</SelectContent>
		</Select>
	{/snippet}
</FieldWrapper>
