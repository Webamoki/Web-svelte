<script generics="V extends number | string" lang="ts">
  import type { Snippet } from 'svelte';

  import Check from '@lucide/svelte/icons/check';
  import { Select } from 'bits-ui';
  import { getContext } from 'svelte';

  import { SELECT_FIELD_CONTEXT, type SelectFieldContext } from './select-field-context.js';

  interface Props {
    /** The visible option content — plain text or rich markup (e.g. an icon). */
    children: Snippet;
    /** Plain-text label for typeahead/accessibility. Defaults to `String(value)`. */
    label?: string;
    value: V;
  }

  let { children: content, label, value }: Props = $props();

  // `<Option>` is a static declaration (like a native `<option>`) — `value` is captured once,
  // not tracked reactively across later prop changes.
  // svelte-ignore state_referenced_locally
  const key = String(value);
  const resolvedLabel = $derived(label ?? key);

  const ctx = getContext<SelectFieldContext>(SELECT_FIELD_CONTEXT);
  // Registers this option's rich content against its key so the parent `<SelectField>` can
  // re-render the SAME snippet as the closed-trigger display when this option is selected —
  // called synchronously at init (not inside `$effect`, which only runs post-mount and would
  // flash the placeholder for one frame on first render). `<Option>` is a static declaration
  // (like a native `<option>`) — this is a one-time snapshot, not meant to track later prop changes.
  // svelte-ignore state_referenced_locally
  ctx.register(key, { content, label: resolvedLabel, value });
  $effect(() => {
    return () => ctx.unregister(key);
  });
</script>

<Select.Item class="form-select-item" label={resolvedLabel} value={key}>
  {#snippet children({ selected })}
    <span class="form-select-item-label">{@render content()}</span>
    {#if selected}<Check class="form-select-item-check" size={14} />{/if}
  {/snippet}
</Select.Item>
