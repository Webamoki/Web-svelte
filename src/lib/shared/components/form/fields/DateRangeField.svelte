<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';

  import FieldLabel from '../FieldLabel.svelte';

  type LooseField = {
    as(type: string): { [k: string]: unknown; name: string };
    issues(): Array<{ message: string; path: Array<number | string> }> | undefined;
  };

  interface Props {
    children?: Snippet;
    endName: keyof Input & string;
    form: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    required?: boolean;
    startName: keyof Input & string;
  }

  let { children, endName, form, required, startName }: Props = $props();

  const startField = $derived((form.fields as Record<string, LooseField>)[startName]);
  const endField = $derived((form.fields as Record<string, LooseField>)[endName]);
  const startAttrs = $derived(startField.as('date'));
  const endAttrs = $derived(endField.as('date'));
</script>

<div class="form-field">
  {#if children}
    <FieldLabel for={startAttrs.name} {required}>{@render children()}</FieldLabel>
  {/if}
  <div class="form-date-range">
    <input id={startAttrs.name} class="form-date-range-input" type="date" {...startAttrs} />
    <span class="form-date-range-sep" aria-hidden="true">–</span>
    <input id={endAttrs.name} class="form-date-range-input" type="date" {...endAttrs} />
  </div>
  {#each startField.issues() ?? [] as issue (`start-${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
  {#each endField.issues() ?? [] as issue (`end-${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
