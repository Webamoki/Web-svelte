<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';
  import type { ZodType } from 'zod/v4';

  import ColorPicker from 'svelte-awesome-color-picker';

  import { createFormView, createLocalTextView, type FieldView } from '../field-view.svelte.js';
  import FieldLabel from '../FieldLabel.svelte';

  interface Props {
    children?: Snippet;
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    name: keyof Input & string;
    onChange?: (value: string) => void;
    onInput?: (value: string) => void;
    optional?: boolean;
    schema?: ZodType;
    value?: string;
  }

  let {
    children,
    form,
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

  // Current stored value without the leading '#'.
  const current = $derived(String(attrs.value ?? ''));

  // ColorPicker expects '#rrggbb'; the field stores without '#'. ColorPicker's hex
  // prop has a fallback, so it must never be bound to undefined. Writable derived:
  // tracks the stored value, but ColorPicker can override it via `bind:hex`.
  const DEFAULT_HEX = '#000000';
  let hex: string = $derived(current ? `#${current}` : DEFAULT_HEX);
  let hiddenInput: HTMLInputElement | undefined = $state();

  $effect(() => {
    const raw = hex.slice(1);
    if (current !== raw) {
      if (!current && hex === DEFAULT_HEX) return;
      view.set(raw);
      if (hiddenInput) {
        // Set DOM value synchronously before dispatching so handle_input reads the correct
        // value instead of the stale pre-update value, which would cause an infinite loop.
        hiddenInput.value = raw;
        hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  });
</script>

{#if children}
  <FieldLabel for={attrs.name} {required}>{@render children()}</FieldLabel>
{/if}
<!-- Hidden input puts the value into FormData so validate() and submit pick it up.
     Value is managed directly in the $effect above — not via reactive binding. -->
<input bind:this={hiddenInput} name={attrs.name} type="hidden" />
<ColorPicker isAlpha={false} position="responsive" bind:hex />
{#each view.issues() as issue (`${issue.path}`)}
  <p class="form-error">{issue.message}</p>
{/each}
