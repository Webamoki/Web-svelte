<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Component, Snippet } from 'svelte';

  import UiInput from '$lib/shared/components/ui/Input.svelte';

  type LooseField = {
    as(type: string): { [k: string]: unknown; name: string };
    issues(): Array<{ message: string; path: Array<number | string> }> | undefined;
  };

  interface Props {
    children?: Snippet;
    form: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    icon?: Component;
    name: keyof Input & string;
    placeholder?: string;
    type: string;
  }

  let { children, form, icon, name, placeholder, type }: Props = $props();
  // svelte-ignore state_referenced_locally
  const field = (form.fields as Record<string, LooseField>)[name];
  // svelte-ignore state_referenced_locally
  const attrs = field.as(type);
</script>

<div class="form-field">
  {#if children}
    <label class="form-label" for={attrs.name}>{@render children()}</label>
  {/if}
  <UiInput id={attrs.name} {icon} {placeholder} {...attrs} />
  {#each field.issues() ?? [] as issue (`${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
