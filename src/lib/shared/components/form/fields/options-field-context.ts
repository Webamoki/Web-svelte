import type { Snippet } from 'svelte';

/** Shared context key linking a declarative `<Option>` to its ancestor `<OptionsField>`. */
export const OPTIONS_FIELD_CONTEXT = Symbol('web-svelte:options-field');

export type OptionsFieldEntry = {
  content: Snippet;
  label: string;
  /** The option's typed value — read back as `unknown`, cast to `V` by `<OptionsField>` (the
   *  only place that knows the concrete `V` for this instance). */
  value: unknown;
};

export type OptionsFieldContext = {
  register: (key: string, entry: OptionsFieldEntry) => void;
  unregister: (key: string) => void;
};
