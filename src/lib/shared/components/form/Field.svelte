<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Component, Snippet } from 'svelte';

  import UiInput from '$lib/shared/components/ui/Input.svelte';

  import FieldLabel from './FieldLabel.svelte';

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
    required?: boolean;
    type: string;
  }

  let { children, form, icon, name, placeholder, required, type }: Props = $props();
  // svelte-ignore state_referenced_locally
  const field = (form.fields as Record<string, LooseField>)[name];
  // svelte-ignore state_referenced_locally
  const attrs = field.as(type);

  const displayPlaceholder = $derived(
    required === false && !children && placeholder != null
      ? `(Optional) ${placeholder}`
      : placeholder
  );
</script>

<div class="form-field">
  {#if children}
    <FieldLabel for={attrs.name} {required}>{@render children()}</FieldLabel>
  {/if}
  <UiInput id={attrs.name} {icon} placeholder={displayPlaceholder} {required} {...attrs} />
  {#each field.issues() ?? [] as issue, i (i)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
