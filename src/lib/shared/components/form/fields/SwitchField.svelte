<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';

  import { Switch } from 'bits-ui';

  type LooseField = {
    as(type: 'checkbox'): {
      'aria-invalid': 'false' | 'true' | boolean | undefined;
      readonly checked: boolean;
      name: string;
      type: 'checkbox';
      value?: string;
    };
    issues(): Array<{ message: string; path: Array<number | string> }> | undefined;
  };

  interface Props {
    children?: Snippet;
    description?: string;
    disabled?: boolean;
    form: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    name: keyof Input & string;
  }

  let { children, description, disabled, form, name }: Props = $props();
  const field = $derived((form.fields as Record<string, LooseField>)[name]);
  const attrs = $derived(field.as('checkbox'));

  let checked = $state(false);
  $effect(() => {
    checked = attrs.checked;
  });
</script>

<div class="form-switch-wrapper">
  <div class="form-switch-row">
    {#if children}
      <label class="form-switch-label" for={attrs.name}>
        {@render children()}
      </label>
    {/if}
    <Switch.Root
      id={attrs.name}
      name={attrs.name}
      class="form-switch"
      aria-invalid={attrs['aria-invalid']}
      {checked}
      {disabled}
      onCheckedChange={(v) => (checked = v === true)}
    >
      <Switch.Thumb class="form-switch-thumb" />
    </Switch.Root>
  </div>
  {#if description}
    <p class="form-description form-description--indented">{description}</p>
  {/if}
  {#each field.issues() ?? [] as issue (`${issue.path}`)}
    <p class="form-error form-error--indented">{issue.message}</p>
  {/each}
</div>
