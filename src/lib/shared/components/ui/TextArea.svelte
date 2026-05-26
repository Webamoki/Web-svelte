<script lang="ts">
  import type { Component } from 'svelte';
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  type Props = HTMLTextareaAttributes & {
    class?: string;
    defaultHeight?: number;
    icon?: Component;
    resize?: boolean;
    value?: string;
  };

  let {
    class: className,
    defaultHeight = 100,
    icon,
    resize = false,
    value = $bindable(),
    ...rest
  }: Props = $props();
</script>

{#if icon}
  {@const Icon = icon}
  <div class="form-input-wrapper">
    <div class="form-input-icon form-input-icon--top">
      <Icon />
    </div>
    <textarea
      style="height: {defaultHeight}px; min-height: {defaultHeight}px;"
      class={[
        'form-input',
        'form-textarea',
        'form-input--with-icon',
        resize && 'form-textarea--resize',
        className
      ]
        .filter(Boolean)
        .join(' ')}
      bind:value
      {...rest}
    ></textarea>
  </div>
{:else}
  <textarea
    style="height: {defaultHeight}px; min-height: {defaultHeight}px;"
    class={['form-input', 'form-textarea', resize && 'form-textarea--resize', className]
      .filter(Boolean)
      .join(' ')}
    bind:value
    {...rest}
  ></textarea>
{/if}
