# Form System Upgrade: Server Actions → Remote Functions

## Decisions

| Decision      | Choice                                                           |
| ------------- | ---------------------------------------------------------------- |
| Superforms    | DROP — incompatible with remote functions                        |
| Formsnap      | DROP — replace with native field props                           |
| VirtualForm   | DROP — `command()` replaces it                                   |
| processForm() | DROP — validation is the schema arg in `form()`                  |
| Zod           | KEEP — Zod v4 is Standard Schema compliant, works with `form()`  |
| Field binding | Explicit prop — `field={saveUser.fields.email}`                  |
| prepareForm   | REPURPOSE — becomes thin `.enhance()` wrapper, not state manager |

---

## How Remote Functions Actually Work (form API)

### Define the remote fn — schema IS validation

```typescript
// +page.remote.ts
import { form } from '$app/server';
import { MySchema } from './schema.js'; // zod schema

export const saveUser = form(
  MySchema, // Standard Schema — zod v4 compliant
  async ({ email, name }) => {
    await db.insert({ email, name });
    return { success: true, text: 'Saved!' };
  }
);
```

No `processForm()`, no `superValidate()`. Schema arg handles server-side validation.

### The form object is the state

`saveUser` is a reactive object with:

- `saveUser.fields.email` — field object with `.as()`, `.issues()`, `.value()`, `.set()`
- `saveUser.pending` — boolean, replaces `isProcessing`
- `saveUser.result` — last submission result
- `saveUser.enhance(fn)` — progressive enhancement with custom logic
- `saveUser.validate()` — trigger validation manually

### Field objects

```typescript
saveUser.fields.email.as('text'); // → input attributes (name, value, etc.)
saveUser.fields.email.as('text', 'default'); // → with pre-filled value (for edit forms)
saveUser.fields.email.issues(); // → validation error array
saveUser.fields.email.value(); // → current value
saveUser.fields.email.set('foo@bar.com'); // → set value programmatically
```

### Progressive enhancement / enhance

```typescript
saveUser.enhance(async ({ form, data, submit }) => {
  if (await submit()) {
    form.reset();
    toast.success('Saved!');
  }
});
// Returns attributes to spread onto <form>
```

### command() — replaces VirtualForm

```typescript
// +page.remote.ts
import { command } from '$app/server';

export const deleteUser = command(z.string(), async (userId) => {
  await db.delete(userId);
});
```

```svelte
<button onclick={() => deleteUser(user.id)}>Delete</button>
```

---

## New Page Usage (consumer-facing API)

```svelte
<script>
  import { saveUser } from './+page.remote.ts';
  import { prepareForm } from '$lib/shared/utils/form';
  import { TextField, Button, Form } from '$lib/shared/components/form';
</script>

<Form action={prepareForm(saveUser, { onSuccess: () => goto('/dashboard') })}>
  <TextField field={saveUser.fields.email} label="Email" />
  <TextField field={saveUser.fields.name} label="Name" />
  <Button pending={saveUser.pending}>Submit</Button>
</Form>

<!-- Edit form (pre-filled) -->
<Form action={prepareForm(saveUser, { data: existingUser })}>
  <TextField field={saveUser.fields.email} label="Email" defaultValue={existingUser.email} />
</Form>
```

---

## New API Design

### `prepareForm(remoteForm, options?)` — wraps `.enhance()`

```typescript
type PrepareFormOptions = {
  data?: Record<string, unknown>; // pre-fill values (edit forms)
  onSuccess?: (result: unknown) => void;
  onError?: (error: unknown) => void;
  onUpdated?: () => void;
  resetForm?: boolean; // default: true
  showToast?: boolean; // default: true
  invalidateAll?: boolean; // default: false
};

function prepareForm(remoteForm: RemoteForm, options?: PrepareFormOptions): FormAttributes;
// Returns attributes spread onto <form> via remoteForm.enhance(...)
```

Internal logic:

```typescript
function prepareForm(remoteForm, options = {}) {
  return remoteForm.enhance(async ({ form, submit }) => {
    try {
      const result = await submit();
      if (result) {
        if (options.showToast !== false && result.text) toast.success(result.text);
        options.onSuccess?.(result);
        if (options.resetForm !== false) form.reset();
        if (options.invalidateAll) invalidateAll();
      }
    } catch (e) {
      if (options.showToast !== false) toast.error('Something went wrong');
      options.onError?.(e);
    }
    options.onUpdated?.();
  });
}
```

### `<Form>` component

```svelte
<!-- Props -->
let { action, class: className, children } = $props();

<!-- Template -->
<form {...action} class={className}>
  {@render children()}
</form>
```

`action` receives the spread attrs from `prepareForm()`. Thin wrapper — just applies class + renders slot.

### Field components — new prop shape

Old: `<TextField {form} name="email" label="Email" />`
New: `<TextField field={saveUser.fields.email} label="Email" />`

Field prop type:

```typescript
type RemoteField = {
  as(type: string, defaultValue?: unknown): Record<string, unknown>;
  issues(): Array<{ message: string }>;
  value(): unknown;
  set(value: unknown): void;
};
```

### `<FieldWrapper>` — drop formsnap, use issues array

```svelte
<!-- Props -->
let {(label, (issues = []), description, children)} = $props();

<!-- Template -->
<div class="field">
  <label>{label}</label>
  {@render children()}
  {#each issues as issue}
    <p class="error">{issue.message}</p>
  {/each}
  {#if description}<p class="description">{description}</p>{/if}
</div>
```

### `<TextField>` — example of updated field component

```svelte
<script>
  let { field, label, description, icon, type = 'text', ...rest } = $props();
</script>

<FieldWrapper {label} {description} issues={field.issues()}>
  <IconInputWrapper {icon}>
    <input {...field.as(type)} {...rest} />
  </IconInputWrapper>
</FieldWrapper>
```

---

## Standard Return Shape for Remote Fns

```typescript
type FormResult = {
  success: boolean;
  text?: string; // toast message
  data?: unknown; // passed to onSuccess()
  showToast?: boolean; // override — default true
};
```

All remote form fns should return this shape. `prepareForm` reads `result.text` for toast, passes `result.data` to `onSuccess`.

---

## Files to Change

### DELETE

| File                                        | Reason                                      |
| ------------------------------------------- | ------------------------------------------- |
| `src/lib/shared/utils/form/virtual-form.ts` | command() replaces it                       |
| `src/lib/shared/server/form-processor.ts`   | schema arg in form() replaces superValidate |

### REWRITE

| File                                                                   | What changes                                                                 |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `src/lib/shared/utils/form/index.ts`                                   | Drop superforms. `prepareForm` wraps `.enhance()`. Export `FormResult` type. |
| `src/lib/shared/components/form/Form.svelte`                           | Drop `FsSuperForm`. Accept `action` (spread attrs from prepareForm).         |
| `src/lib/shared/components/form/FieldWrapper.svelte`                   | Drop formsnap `Field/Control/Label`. Accept `issues` array prop.             |
| `src/lib/shared/components/form/Button.svelte`                         | Accept `pending` bool instead of reading from form store.                    |
| `src/lib/shared/components/form/fields/TextField.svelte`               | Drop `{form} name` props. Accept `field` object prop.                        |
| `src/lib/shared/components/form/fields/PasswordField.svelte`           | Same as TextField                                                            |
| `src/lib/shared/components/form/fields/NumberField.svelte`             | Same as TextField                                                            |
| `src/lib/shared/components/form/fields/MessageField.svelte`            | Same as TextField                                                            |
| `src/lib/shared/components/form/fields/CheckboxField.svelte`           | `field.as('checkbox')`                                                       |
| `src/lib/shared/components/form/fields/SelectField.svelte`             | `field.as('select')` — needs bits-ui compat check                            |
| `src/lib/shared/components/form/fields/SelectMultiField.svelte`        | Same as SelectField                                                          |
| `src/lib/shared/components/form/fields/DateField.svelte`               | `field.as('text')` + calendar picker — needs custom binding                  |
| `src/lib/shared/components/form/fields/TimeField.svelte`               | Same as DateField                                                            |
| `src/lib/shared/components/form/fields/HexColorField.svelte`           | `field.as('text')`                                                           |
| `src/lib/shared/components/form/fields/PinField.svelte`                | Custom binding via `field.value()` + `field.set()`                           |
| `src/lib/shared/components/form/fields/ChoiceField.svelte`             | `field.as('radio', value)`                                                   |
| `src/lib/shared/components/form/fields/ChoiceMultiField.svelte`        | `field.as('checkbox', value)` per option                                     |
| `src/lib/shared/components/form/fields/WeekdayChoiceField.svelte`      | Same as ChoiceField                                                          |
| `src/lib/shared/components/form/fields/WeekdayChoiceMultiField.svelte` | Same as ChoiceMultiField                                                     |
| `src/routes/form/+page.svelte`                                         | Update showcase to new API                                                   |

### CREATE

| File                                 | Purpose                                                 |
| ------------------------------------ | ------------------------------------------------------- |
| `src/routes/form/+page.remote.ts`    | Remote fn replacing `+page.server.ts` actions           |
| `src/lib/shared/utils/form/types.ts` | `FormResult`, `RemoteField`, `PrepareFormOptions` types |

### REMOVE DEPS (after migration)

- `sveltekit-superforms`
- `formsnap`

---

## Risk: Complex Fields (SelectField, DateField, PinField)

These use custom UI (bits-ui popover, calendar, pin input) — can't simply spread `field.as(type)` onto a custom component.

**Pattern for these fields:**

```typescript
// Use field.value() + field.set() for two-way binding
let value = $derived(field.value());

function handleChange(newVal) {
  field.set(newVal);
}
```

This works because `field.set()` updates the form's internal state, and `field.value()` reads it reactively.

---

## Remaining Questions

### RQ1 — Does Zod v4 actually work as schema arg in `form()`?

Docs only show valibot. Zod v4 implements Standard Schema spec. Need to verify at start of implementation with a minimal test. If not: may need to add valibot as secondary validation lib for remote fn args only.

### RQ2 — TextFieldNullable

Currently has its own component for nullable strings. Does `field.as('text')` + empty string = null behavior? Or do we need to transform in the remote fn?

### RQ3 — Date/Time transport

`DateField` and `TimeField` use `@internationalized/date` types (`CalendarDate`, `Time`). Remote functions serialize via structured clone / JSON — these types won't survive. Need to either:

- Serialize as ISO string in field, deserialize in remote fn
- Use `field.set()` / `field.value()` with manual string conversion

---

## Implementation Order

1. Verify zod v4 works with `form()` — small spike
2. Rewrite `prepareForm` + types
3. Rewrite `FieldWrapper` — no formsnap
4. Rewrite `Form.svelte`
5. Rewrite simple fields: TextField, PasswordField, NumberField, MessageField, HexColorField, CheckboxField
6. Rewrite complex fields: SelectField, DateField, TimeField, PinField
7. Rewrite choice fields: ChoiceField, ChoiceMultiField, WeekdayChoiceField, WeekdayChoiceMultiField
8. Delete virtual-form.ts, form-processor.ts
9. Update showcase routes
10. Remove deps
