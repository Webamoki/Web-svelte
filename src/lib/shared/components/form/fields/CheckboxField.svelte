<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';

  import CheckIcon from '@lucide/svelte/icons/check';
  import { Checkbox } from 'bits-ui';

  import FieldLabel from '../FieldLabel.svelte';

  type LooseField = {
    as(type: 'checkbox'): {
      'aria-invalid': 'false' | 'true' | boolean | undefined;
      readonly checked: boolean;
      name: string;
      type: 'checkbox';
      value?: string;
    };
    issues(): Array<{ message: string; path: Array<number | string> }> | undefined;
    set(input: unknown): unknown;
    value(): unknown;
  };

  interface Props {
    children?: Snippet;
    description?: string;
    disabled?: boolean;
    form: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    name: keyof Input & string;
    required?: boolean;
  }

  let { children, description, disabled, form, name, required }: Props = $props();
  const field = $derived((form.fields as Record<string, LooseField>)[name]);
  const attrs = $derived(field.as('checkbox'));
</script>

<div class="form-checkbox-wrapper">
  <div class="form-checkbox-row">
    <Checkbox.Root
      id={attrs.name}
      name={attrs.name}
      class="form-checkbox"
      aria-invalid={attrs['aria-invalid']}
      checked={attrs.checked}
      {disabled}
      onCheckedChange={(v) => field.set(v === true)}
      {required}
    >
      {#snippet children({ checked })}
        {#if checked}
          <CheckIcon class="form-checkbox-icon" />
        {/if}
      {/snippet}
    </Checkbox.Root>
    {#if children}
      <FieldLabel class="form-checkbox-label" for={attrs.name} {required}>
        {@render children()}
      </FieldLabel>
    {/if}
  </div>
  {#if description}
    <p class="form-description form-description--indented">{description}</p>
  {/if}
  {#each field.issues() ?? [] as issue (`${issue.path}`)}
    <p class="form-error form-error--indented">{issue.message}</p>
  {/each}
</div>
