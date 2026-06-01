import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
import type { ZodType } from 'zod/v4';

/** Normalised validation issue shape consumed by every field template. */
export type FieldIssue = { message: string; path: Array<number | string> };

/**
 * The surface every field template consumes. Produced either from a `RemoteForm`
 * field (`createFormView`) or from local `$bindable` state (`createLocal*View`).
 * `attrs` is spread onto the underlying input/select/checkbox.
 */
export type FieldView = {
  readonly attrs: Record<string, unknown> & { name: string };
  issues: () => FieldIssue[];
  set: (value: unknown) => void;
};

type LooseFormField = {
  as(type: string, ...args: unknown[]): Record<string, unknown> & { name: string };
  issues(): FieldIssue[] | undefined;
  set(input: unknown): unknown;
};

/**
 * Wrap a `RemoteForm` field. `as()` is called ONLY here, so the standalone path
 * never touches it. Must be called during component init (uses `$derived`).
 */
export function createFormView<Input extends RemoteFormInput>(
  form: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>,
  name: string,
  type: string,
  asArgs: unknown[] = []
): FieldView {
  const field = $derived((form.fields as Record<string, LooseFormField>)[name]);
  const attrs = $derived(field.as(type, ...asArgs));
  return {
    get attrs() {
      return attrs;
    },
    issues: () => field.issues() ?? [],
    set: (value) => field.set(value)
  };
}

function schemaIssues(schema: undefined | ZodType, value: unknown): FieldIssue[] {
  if (!schema) return [];
  const result = schema.safeParse(value);
  if (result.success) return [];
  return result.error.issues.map((issue) => ({
    message: issue.message,
    path: issue.path as Array<number | string>
  }));
}

type LocalOpts<T> = {
  /** Reads the parent `$bindable` value. */
  get: () => T;
  name: string;
  onChange?: (value: T) => void;
  onInput?: (value: T) => void;
  schema?: ZodType;
  /** Writes the parent `$bindable` value. */
  write: (value: T) => void;
};

/**
 * Text-like standalone view (text/number/date/time/email/password/etc.).
 * Builds its own `oninput`/`onchange` since `as()` does not provide them.
 */
export function createLocalTextView<T>(opts: LocalOpts<T>): FieldView {
  const issues = $derived.by(() => schemaIssues(opts.schema, opts.get()));
  const attrs = $derived({
    'aria-invalid': issues.length > 0 ? ('true' as const) : undefined,
    name: opts.name,
    onchange: (event: Event) => {
      const value = (event.currentTarget as HTMLInputElement).value as unknown as T;
      opts.onChange?.(value);
    },
    oninput: (event: Event) => {
      const value = (event.currentTarget as HTMLInputElement).value as unknown as T;
      opts.write(value);
      opts.onInput?.(value);
    },
    value: (opts.get() ?? '') as unknown
  });
  return {
    get attrs() {
      return attrs;
    },
    issues: () => issues,
    set: (value) => {
      opts.write(value as T);
      opts.onInput?.(value as T);
      opts.onChange?.(value as T);
    }
  };
}

/** Checkbox/switch standalone view — `checked` instead of `value`, boolean state. */
export function createLocalCheckboxView(opts: LocalOpts<boolean>): FieldView {
  const issues = $derived.by(() => schemaIssues(opts.schema, opts.get()));
  const attrs = $derived({
    'aria-invalid': issues.length > 0 ? ('true' as const) : undefined,
    checked: opts.get() === true,
    name: opts.name,
    type: 'checkbox' as const
  });
  return {
    get attrs() {
      return attrs;
    },
    issues: () => issues,
    set: (value) => {
      const next = value === true;
      opts.write(next);
      opts.onInput?.(next);
      opts.onChange?.(next);
    }
  };
}

/**
 * File standalone view — the native file input stays uncontrolled, so `set` is a
 * no-op; `attrs` only carries the name + validity, and `issues()` validates the
 * currently-selected files against the optional schema.
 */
export function createLocalFileView(opts: {
  get: () => File[];
  name: string;
  schema?: ZodType;
}): FieldView {
  const issues = $derived.by(() => schemaIssues(opts.schema, opts.get()));
  const attrs = $derived({
    'aria-invalid': issues.length > 0 ? ('true' as const) : undefined,
    name: opts.name
  });
  return {
    get attrs() {
      return attrs;
    },
    issues: () => issues,
    set: () => {}
  };
}

/**
 * Slider standalone view — value is a `number` (single) or `number[]` (range).
 * The bits-ui Slider has no native input, so there are no DOM events here; `set`
 * is driven by the component's `onValueChange`.
 */
export function createLocalSliderView<T extends number | number[]>(opts: LocalOpts<T>): FieldView {
  const issues = $derived.by(() => schemaIssues(opts.schema, opts.get()));
  const attrs = $derived({
    'aria-invalid': issues.length > 0 ? ('true' as const) : undefined,
    name: opts.name,
    value: opts.get() as unknown
  });
  return {
    get attrs() {
      return attrs;
    },
    issues: () => issues,
    set: (value) => {
      opts.write(value as T);
      opts.onInput?.(value as T);
      opts.onChange?.(value as T);
    }
  };
}

/** Select standalone view — `set` receives the already-resolved typed value. */
export function createLocalSelectView<T>(opts: LocalOpts<T>): FieldView {
  const issues = $derived.by(() => schemaIssues(opts.schema, opts.get()));
  const attrs = $derived({
    'aria-invalid': issues.length > 0 ? ('true' as const) : undefined,
    name: opts.name,
    value: (opts.get() ?? '') as unknown
  });
  return {
    get attrs() {
      return attrs;
    },
    issues: () => issues,
    set: (value) => {
      opts.write(value as T);
      opts.onInput?.(value as T);
      opts.onChange?.(value as T);
    }
  };
}
