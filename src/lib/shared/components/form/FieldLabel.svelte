<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    for: string;
    class?: string;
    required?: boolean;
    children?: Snippet;
  }

  let { for: forId, class: className = 'form-label', required, children }: Props = $props();
</script>

<label class={className} for={forId}>
  {@render children?.()}
  {#if required === true}
    <span class="form-required-star" aria-hidden="true">*</span>
  {/if}
</label>
