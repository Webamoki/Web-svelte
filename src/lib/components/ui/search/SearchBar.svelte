<script lang="ts">
  import Input from '$lib/shadcn/components/ui/input/input.svelte';
  import { cn } from '$lib/shadcn/utils.js';
  import { Search } from '@lucide/svelte';

  interface Props {
    class?: string;
    defaultValue?: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }
  let { class: className, defaultValue, onChange, placeholder }: Props = $props();
</script>

<div class="relative w-full max-w-sm">
  <Search class="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  <Input
    class={cn('w-full pl-9', className)}
    oninput={(e: Event & { currentTarget: HTMLInputElement }) => onChange(e.currentTarget.value)}
    {placeholder}
    type="search"
    value={defaultValue}
  />
</div>
