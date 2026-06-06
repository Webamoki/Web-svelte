<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';
  import type { ZodType } from 'zod/v4';

  import CheckIcon from '@lucide/svelte/icons/check';
  import { Checkbox } from 'bits-ui';

  import { createFormView, createLocalCheckboxView, type FieldView } from '../field-view.svelte.js';
  import FieldLabel from '../FieldLabel.svelte';

  interface Props {
    checked?: boolean;
    children?: Snippet;
    description?: string;
    disabled?: boolean;
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    name: keyof Input & string;
    onChange?: (value: boolean) => void;
    optional?: boolean;
    schema?: ZodType;
  }

  let {
    checked = $bindable(false),
    children,
    description,
    disabled,
    form,
    name,
    onChange,
    optional,
    schema
  }: Props = $props();

  // `as('checkbox')` is reached only via the `form` branch; standalone uses local state.
  // svelte-ignore state_referenced_locally
  const view: FieldView = form
    ? createFormView(form, name, 'checkbox')
    : createLocalCheckboxView({
        get: () => checked,
        name,
        onChange,
        schema,
        write: (v) => (checked = v)
      });

  const attrs = $derived(view.attrs);
  const required = $derived(!optional);
</script>

<div class="form-checkbox-wrapper">
  <div class="form-checkbox-row">
    <Checkbox.Root
      id={attrs.name}
      name={attrs.name}
      class="form-checkbox"
      aria-invalid={attrs['aria-invalid'] as 'false' | 'true' | boolean | undefined}
      checked={attrs.checked as boolean}
      {disabled}
      onCheckedChange={(v) => view.set(v === true)}
    >
      {#snippet children({ checked: isChecked })}
        {#if isChecked}
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
  {#each view.issues() as issue (`${issue.path}`)}
    <p class="form-error form-error--indented">{issue.message}</p>
  {/each}
</div>
