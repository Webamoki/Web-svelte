import type { Snippet } from 'svelte';

/** Shared context key linking a declarative `<Option>` to its ancestor `<SelectField>`. */
export const SELECT_FIELD_CONTEXT = Symbol('web-svelte:select-field');

export type SelectFieldEntry = {
  content: Snippet;
  label: string;
  /** The option's typed value — read back as `unknown`, cast to `V` by `<SelectField>` (the
   *  only place that knows the concrete `V` for this instance). */
  value: unknown;
};

export type SelectFieldContext = {
  /** Live search query, only set by `<Combobox>` — `<Option>` filters itself against it. */
  getQuery?: () => string;
  register: (key: string, entry: SelectFieldEntry) => void;
  unregister: (key: string) => void;
};
