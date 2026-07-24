<script lang="ts">
  import type { Component, Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    icon?: Component;
    onclick: () => void;
  }

  let { children, icon: Icon, onclick }: Props = $props();
</script>

<button class="form-combobox-action" {onclick} type="button">
  {#if Icon}<Icon size={13} />{/if}
  {@render children()}
</button>
