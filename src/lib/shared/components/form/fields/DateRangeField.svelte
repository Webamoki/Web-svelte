<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';
  import type { ZodType } from 'zod/v4';

  import { createFormView, createLocalTextView, type FieldView } from '../field-view.svelte.js';
  import FieldLabel from '../FieldLabel.svelte';

  interface Props {
    children?: Snippet;
    endName: keyof Input & string;
    endSchema?: ZodType;
    endValue?: string;
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    onChange?: (range: { end: string; start: string }) => void;
    optional?: boolean;
    startName: keyof Input & string;
    startSchema?: ZodType;
    startValue?: string;
  }

  let {
    children,
    endName,
    endSchema,
    endValue = $bindable(''),
    form,
    onChange,
    optional,
    startName,
    startSchema,
    startValue = $bindable('')
  }: Props = $props();

  // `as('date')` is reached only via the `form` branch; standalone uses local state.
  // svelte-ignore state_referenced_locally
  const startView: FieldView = form
    ? createFormView(form, startName, 'date')
    : createLocalTextView<string>({
        get: () => startValue,
        name: startName,
        onInput: () => onChange?.({ end: endValue, start: startValue }),
        schema: startSchema,
        write: (v) => (startValue = v)
      });
  // svelte-ignore state_referenced_locally
  const endView: FieldView = form
    ? createFormView(form, endName, 'date')
    : createLocalTextView<string>({
        get: () => endValue,
        name: endName,
        onInput: () => onChange?.({ end: endValue, start: startValue }),
        schema: endSchema,
        write: (v) => (endValue = v)
      });

  const required = $derived(!optional);
  const startAttrs = $derived(startView.attrs);
  const endAttrs = $derived(endView.attrs);
</script>

<div class="form-field">
  {#if children}
    <FieldLabel for={startAttrs.name} {required}>{@render children()}</FieldLabel>
  {/if}
  <div class="form-date-range">
    <input
      id={startAttrs.name}
      class="form-date-range-input"
      {required}
      type="date"
      {...startAttrs}
    />
    <span class="form-date-range-sep" aria-hidden="true">–</span>
    <input id={endAttrs.name} class="form-date-range-input" {required} type="date" {...endAttrs} />
  </div>
  {#each startView.issues() as issue (`start-${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
  {#each endView.issues() as issue (`end-${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
