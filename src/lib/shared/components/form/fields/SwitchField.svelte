<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';
  import type { ZodType } from 'zod/v4';

  import { Switch } from 'bits-ui';

  import { createFormView, createLocalCheckboxView, type FieldView } from '../field-view.svelte.js';
  import FieldLabel from '../FieldLabel.svelte';

  interface Props {
    checked?: boolean;
    children?: Snippet;
    description?: string;
    disabled?: boolean;
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    name: keyof Input & string;
    /** Label shown in the `onoff` variant when unchecked (default "OFF"). */
    offLabel?: string;
    onChange?: (value: boolean) => void;
    /** Label shown in the `onoff` variant when checked (default "ON"). */
    onLabel?: string;
    optional?: boolean;
    schema?: ZodType;
    /**
     * `switch` is the sliding pill (default); `onoff` is the ON/OFF labelled
     * style; `button` is a `.btn` that is filled (`default`) when checked and
     * outlined (`ghost`) when unchecked, using `children` as its label.
     */
    variant?: 'button' | 'onoff' | 'switch';
  }

  let {
    checked = $bindable(false),
    children,
    description,
    disabled,
    form,
    name,
    offLabel = 'OFF',
    onChange,
    onLabel = 'ON',
    optional,
    schema,
    variant = 'switch'
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
  const isChecked = $derived(attrs.checked as boolean);
</script>

<div class="form-switch-wrapper">
  <div class="form-switch-row">
    {#if children && variant !== 'button'}
      <FieldLabel class="form-switch-label" for={attrs.name} {required}>
        {@render children()}
      </FieldLabel>
    {/if}
    <Switch.Root
      id={attrs.name}
      name={attrs.name}
      class={variant === 'onoff'
        ? 'form-onoff'
        : variant === 'button'
          ? `btn form-switch-btn ${isChecked ? 'default' : 'ghost'}`
          : 'form-switch'}
      aria-invalid={attrs['aria-invalid'] as 'false' | 'true' | boolean | undefined}
      checked={isChecked}
      {disabled}
      onCheckedChange={(v) => view.set(v === true)}
    >
      {#if variant === 'onoff'}
        <span class="form-onoff-text form-onoff-text--on">{onLabel}</span>
        <span class="form-onoff-text form-onoff-text--off">{offLabel}</span>
        <Switch.Thumb class="form-onoff-thumb" />
      {:else if variant === 'button'}
        {@render children?.()}
      {:else}
        <Switch.Thumb class="form-switch-thumb" />
      {/if}
    </Switch.Root>
  </div>
  {#if description}
    <p class="form-description form-description--indented">{description}</p>
  {/if}
  {#each view.issues() as issue (`${issue.path}`)}
    <p class="form-error form-error--indented">{issue.message}</p>
  {/each}
</div>
