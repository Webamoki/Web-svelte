<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';
  import type { ZodType } from 'zod/v4';

  import MinusIcon from '@lucide/svelte/icons/minus';
  import { PinInput } from 'bits-ui';

  import { createFormView, createLocalTextView, type FieldView } from '../field-view.svelte.js';
  import FieldLabel from '../FieldLabel.svelte';

  interface Props {
    children?: Snippet;
    class?: string;
    description?: string;
    disabled?: boolean;
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    maxlength?: number;
    name: keyof Input & string;
    onChange?: (value: string) => void;
    onInput?: (value: string) => void;
    optional?: boolean;
    schema?: ZodType;
    value?: string;
  }

  let {
    children,
    class: className,
    description,
    disabled,
    form,
    maxlength = 6,
    name,
    onChange,
    onInput,
    optional,
    schema,
    value = $bindable('')
  }: Props = $props();

  // `as('text')` is reached only via the `form` branch; standalone uses local state.
  // svelte-ignore state_referenced_locally
  const view: FieldView = form
    ? createFormView(form, name, 'text')
    : createLocalTextView<string>({
        get: () => value,
        name,
        onChange,
        onInput,
        schema,
        write: (v) => (value = v)
      });

  const attrs = $derived(view.attrs);
  const required = $derived(!optional);

  let pinValue = $derived(String(attrs.value ?? ''));
</script>

<div class="form-field">
  {#if children}
    <FieldLabel for={attrs.name} {required}>{@render children()}</FieldLabel>
  {/if}
  <input name={attrs.name} type="hidden" value={pinValue} />
  <PinInput.Root
    class={['form-pin', className].filter(Boolean).join(' ')}
    {disabled}
    {maxlength}
    onValueChange={(v) => view.set(v)}
    textalign="center"
    bind:value={pinValue}
  >
    {#snippet children({ cells })}
      {@const half = Math.ceil(maxlength / 2)}
      <div class="form-pin-group">
        {#each cells.slice(0, half) as cell (cell)}
          <PinInput.Cell class="form-pin-cell" {cell}>
            {cell.char}
            {#if cell.hasFakeCaret}
              <div class="form-pin-caret">
                <div class="form-pin-caret-line"></div>
              </div>
            {/if}
          </PinInput.Cell>
        {/each}
      </div>
      <div class="form-pin-separator" role="separator">
        <MinusIcon class="form-pin-separator-icon" />
      </div>
      <div class="form-pin-group">
        {#each cells.slice(half) as cell (cell)}
          <PinInput.Cell class="form-pin-cell" {cell}>
            {cell.char}
            {#if cell.hasFakeCaret}
              <div class="form-pin-caret">
                <div class="form-pin-caret-line"></div>
              </div>
            {/if}
          </PinInput.Cell>
        {/each}
      </div>
    {/snippet}
  </PinInput.Root>
  {#if description}
    <p class="form-description">{description}</p>
  {/if}
  {#each view.issues() as issue (`${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
