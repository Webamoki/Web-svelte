<script generics="T extends Record<string, unknown>, U extends FormPath<T>, M" lang="ts">
  import type { FormPath } from 'sveltekit-superforms';

  import ColorPicker from 'svelte-awesome-color-picker';

  import FieldWrapper, { type FieldWrapperProps } from '../FieldWrapper.svelte';
  interface Props extends FieldWrapperProps<T, U, M> {
    value?: string;
  }
  let { value = $bindable(), ...fieldProps }: Props = $props();

  function get() {
    if (value) return `#${value}`;
    return '';
  }
  function set(raw: string | undefined) {
    if (raw === undefined) return undefined;
    value = raw.slice(1); // remove #
  }
</script>

<FieldWrapper {...fieldProps}>
  {#snippet formElem()}
    <ColorPicker isAlpha={false} label={value} position="responsive" bind:hex={get, set} />
  {/snippet}
</FieldWrapper>
