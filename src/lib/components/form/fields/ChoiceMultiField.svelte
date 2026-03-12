<script
  generics="V,I, K extends number | string | symbol,T extends Record<string, unknown>, U extends FormPath<T>, M"
  lang="ts"
>
  import type { FormPath } from 'sveltekit-superforms';

  import ChoiceMulti, { type ChoiceMultiProps } from '$lib/components/ui/choice/ChoiceMulti.svelte';

  import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

  type Props = ChoiceMultiProps<V, I, K> & FieldWrapperProps<T, U, M> & { class?: string };
  let {
    buttonContent,
    class: className,
    description,
    disabled,
    form,
    getKey,
    getLabel,
    getValue,

    items,
    label,
    name,
    onAdd,
    onRemove,
    readonly,
    value = $bindable([]),
    vertical
  }: Props = $props();
</script>

<FieldWrapper {name} class={className} {description} {form} {label}>
  {#snippet formElem(props)}
    <ChoiceMulti
      {buttonContent}
      {disabled}
      {getKey}
      {getLabel}
      {getValue}
      {items}
      {onAdd}
      {onRemove}
      {readonly}
      {vertical}
      {...props}
      class="w-full"
      bind:value
    />
  {/snippet}
</FieldWrapper>
