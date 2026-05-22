<script lang="ts">
  import Input from '$lib/shared/components/ui/Input.svelte';
  import { Search } from '@lucide/svelte';

  interface Props {
    class?: string;
    defaultValue?: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }
  let { class: className, defaultValue, onChange, placeholder }: Props = $props();
</script>

<Input
  class={className}
  icon={Search}
  oninput={(e: Event & { currentTarget: HTMLInputElement }) => onChange(e.currentTarget.value)}
  {placeholder}
  type="search"
  value={defaultValue}
/>
