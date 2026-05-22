<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';

  import MinusIcon from '@lucide/svelte/icons/minus';
  import { PinInput } from 'bits-ui';

  type LooseField = {
    as(type: 'text'): {
      'aria-invalid': 'false' | 'true' | boolean | undefined;
      name: string;
      readonly value: number | string;
    };
    issues(): Array<{ message: string; path: Array<number | string> }> | undefined;
  };

  interface Props {
    children?: Snippet;
    class?: string;
    description?: string;
    disabled?: boolean;
    form: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    maxlength?: number;
    name: keyof Input & string;
  }

  let {
    children,
    class: className,
    description,
    disabled,
    form,
    maxlength = 6,
    name
  }: Props = $props();

  const field = $derived((form.fields as Record<string, LooseField>)[name]);
  const attrs = $derived(field.as('text'));

  let pinValue = $derived(String(attrs.value ?? ''));
</script>

<div class="form-field">
  {#if children}
    <label class="form-label" for={attrs.name}>{@render children()}</label>
  {/if}
  <input name={attrs.name} type="hidden" value={pinValue} />
  <PinInput.Root
    class={['form-pin', className].filter(Boolean).join(' ')}
    {disabled}
    {maxlength}
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
  {#each field.issues() ?? [] as issue (`${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
