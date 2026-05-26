<script
  generics="V,I, K extends number | string | symbol,T extends Record<string, unknown>, U extends FormPath<T>, M"
  lang="ts"
>
  import type { FormPath } from 'sveltekit-superforms';

  import FieldWrapper, {
    type FieldWrapperProps
  } from '$lib/shared/components/form-old/FieldWrapper.svelte';
  import Choice, { type ChoiceProps } from '$lib/shared/components/ui/choice/Choice.svelte';

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
