<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';

  import ColorPicker from 'svelte-awesome-color-picker';
  import FieldLabel from '../FieldLabel.svelte';

  type LooseField = {
    as(type: 'text'): {
      'aria-invalid': 'false' | 'true' | boolean | undefined;
      name: string;
      value: string;
    };
    issues(): Array<{ message: string; path: Array<number | string> }> | undefined;
    set(input: string): unknown;
    value(): string | undefined;
  };

  interface Props {
    children?: Snippet;
    form: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    name: keyof Input & string;
    required?: boolean;
  }

  let { children, form, name, required }: Props = $props();

  const field = $derived((form.fields as Record<string, LooseField>)[name]);
  const attrs = $derived(field.as('text'));

  // ColorPicker expects '#rrggbb'; field stores without '#'. ColorPicker's hex
  // prop has a fallback, so it must never be bound to undefined.
  const DEFAULT_HEX = '#000000';
  let hex: string = $state(DEFAULT_HEX);

  $effect(() => {
    const v = field.value();
    hex = v ? `#${v}` : DEFAULT_HEX;
  });

  $effect(() => {
    const raw = hex.slice(1);
    if (field.value() !== raw) {
      if (field.value() == null && hex === DEFAULT_HEX) return;
      field.set(raw);
    }
  });
</script>

{#if children}
  <FieldLabel for={attrs.name} {required}>{@render children()}</FieldLabel>
{/if}
<ColorPicker isAlpha={false} position="responsive" bind:hex />
{#each field.issues() ?? [] as issue (`${issue.path}`)}
  <p class="form-error">{issue.message}</p>
{/each}
