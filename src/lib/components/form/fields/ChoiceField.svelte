<script
  generics="V,I, K extends number | string | symbol,T extends Record<string, unknown>, U extends FormPath<T>, M"
  lang="ts"
>
  import type { FormPath } from 'sveltekit-superforms';

  import Choice, { type ChoiceProps } from '$lib/components/ui/choice/Choice.svelte';

  import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';

  type Props = ChoiceProps<V, I, K> &
    FieldWrapperProps<T, U, M> & {
      class?: string;
    };

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
    onChange,
    readonly,
    value = $bindable(undefined),
    vertical
  }: Props = $props();
</script>

<FieldWrapper {name} class={className} {description} {form} {label}>
  {#snippet formElem(props)}
    <Choice
      {buttonContent}
      {disabled}
      {getKey}
      {getLabel}
      {getValue}
      {items}
      {onChange}
      {readonly}
      {vertical}
      bind:value
      {...props}
      class="w-full"
    />
  {/snippet}
</FieldWrapper>
