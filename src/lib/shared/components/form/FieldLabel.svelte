<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children?: Snippet;
    class?: string;
    for: string;
    required?: boolean;
  }

  let { children, class: className = 'form-label', for: forId, required }: Props = $props();
</script>

<label class={className} for={forId}>
  {@render children?.()}
  {#if required === true}
    <span class="form-required-star" aria-hidden="true">*</span>
  {/if}
</label>
