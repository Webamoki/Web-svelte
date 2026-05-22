<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Component, Snippet } from 'svelte';

  import TextArea from '$lib/shared/components/ui/TextArea.svelte';

  type LooseField = {
    as(type: string): { [k: string]: unknown; name: string };
    issues(): Array<{ message: string; path: Array<number | string> }> | undefined;
  };

  interface Props {
    children?: Snippet;
    class?: string;
    defaultHeight?: number;
    form: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    icon?: Component;
    name: keyof Input & string;
    placeholder?: string;
    resize?: boolean;
  }

  let {
    children,
    class: className,
    defaultHeight = 100,
    form,
    icon,
    name,
    placeholder,
    resize = false
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  const field = (form.fields as Record<string, LooseField>)[name];
  const attrs = field.as('text');
</script>

<div class="form-field">
  {#if children}
    <label class="form-label" for={attrs.name}>{@render children()}</label>
  {/if}
  <TextArea
    id={attrs.name}
    class={className}
    {defaultHeight}
    {icon}
    {placeholder}
    {resize}
    {...attrs}
  />
  {#each field.issues() ?? [] as issue (`${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
