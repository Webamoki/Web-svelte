<script
	lang="ts"
	generics="I,V, K extends string | number,T extends Record<string, unknown>, U extends FormPath<T>, M"
>
	import type { FormPath } from 'sveltekit-superforms';
	import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectLabel,
		SelectTrigger
	} from '$lib/shadcn/components/ui/select/index.js';
	import { cn } from '$lib/shadcn/utils.js';

	interface Props extends FieldWrapperProps<T, U, M> {
		values?: V[];
		items: readonly I[];
		getKey: (item: I) => K;
		getLabel: (item: I) => string;
		getValue: (item: I) => V;
		onchange?: (value: V[]) => void;
		class?: string;
		placeholder: string;
	}
	let {
		values = $bindable([]),
		class: className,
		getKey: _getKey,
		getLabel,
		getValue,
		onchange,
		placeholder,
		items,
		...fieldProps
	}: Props = $props();
	let valueToItem: Map<V, I> = new Map(items.map((item) => [getValue(item), item] as const));
	let keyToItem: Map<string, I> = new Map(items.map((item) => [getKey(item), item] as const));

	// Enforce string key functino
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
			<SelectTrigger class={cn('w-[180px] cursor-pointer', className)}>
				{getPreview()}
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>{fieldProps.label}</SelectLabel>
					{#each items as item (getKey(item))}
						<SelectItem class="cursor-pointer" value={getKey(item)} label={getLabel(item)} />
					{/each}
				</SelectGroup>
			</SelectContent>
		</Select>
	{/snippet}
</FieldWrapper>
