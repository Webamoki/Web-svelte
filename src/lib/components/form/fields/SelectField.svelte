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
		value?: V;
		items: readonly I[];
		getKey: (item: I) => K;
		getLabel: (item: I) => string;
		getValue: (item: I) => V;
		onchange?: (value: V | undefined) => void;
		class?: string;
		placeholder: string;
	}
	let {
		value = $bindable(undefined),
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

	function getKeyFromValue(): string {
		if (value === undefined) return '';
		const item = valueToItem.get(value);
		if (item === undefined) return '';
		return getKey(item);
	}

	function setValueFromKey(key: string) {
		const item = keyToItem.get(key);
		if (item === undefined) return;
		const newValue = getValue(item);
		value = newValue;
		onchange?.(newValue);
	}
</script>

<FieldWrapper {...fieldProps}>
	{#snippet formElem(props)}
		<Select type="single" {...props} bind:value={getKeyFromValue, setValueFromKey}>
			<SelectTrigger class={cn('w-[180px] cursor-pointer', className)}>
				{value ? value : placeholder}
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
