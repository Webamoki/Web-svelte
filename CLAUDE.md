# CLAUDE.md

## Project Overview

A Svelte 5 component library for SvelteKit, providing type-safe forms, UI components, and utilities.

- **Package:** `@webamoki/web-svelte`
- **Framework:** Svelte 5 (Runes) & SvelteKit
- **Tech Stack:** Tailwind CSS v4, ArkType, Superforms, Bits UI, Lucide Svelte.

## Package Management

Use `pnpm`, never use `npm`.

- `pnpm test` to run vitest
- `pnpm fmt` to run prettier
- `pnpm lint:es` to run eslint
- `pnpm lint:svelte` to run svelte check
- `pnpm check` to run fmt, lint and test. Checks altogether.

## Guidelines

1. **Type Safety:** Always use **ArkType** for runtime validation and type definitions.
2. **UI Components:** Use **shadcn**, **bits-ui**, and **Tailwind CSS v4** to build/extend UI components. Shadcn components are in `src/lib/shadcn/components/ui`.
3. **Consistency:** Follow existing patterns in `src/lib/shared/components/form` for new fields.

## Core Features

### 1. Form System (`src/lib/shared/components/form`)

Type-safe form handling via `superforms` and `arktype`.

- **`Form`**: Main wrapper with validation.
- **`Button`**: Submission with loading states.
- **Field Components**: `TextField`, `PasswordField`, `NumberField`, `DateField`, `SelectField`, etc.
- **Icon Support**: Fields use `IconInputWrapper` for Lucide icons.
- **Server Handlers**: Located in `src/lib/shared/server/form-handler.ts`.

### 2. UI Components (`src/lib/shared/components/ui`)

Higher-level UI components:

- `Choice`, `ChoiceMulti`, `WeekdayChoice`, `WeekdayChoiceMulti`.
- `ContextMenu`, `SearchBar`, `Draggable`, `Dropzone`.

### 3. Utilities (`src/lib/shared/utils`)

- `datetime`: `@internationalized/date` integration.
- `form`: `prepareForm`.
- `email`: AWS SES via Web Crypto API.
- `search`: Fuzzy search and highlighting.

### Svelte MCP

Use these tools to maintain strictly correct Svelte 5 code:

1. **`list-sections`** — Call FIRST for any Svelte/SvelteKit query to map relevant documentation sections.
2. **`get-documentation`** — Fetch the content for the identified sections before writing code.
3. **`svelte-autofixer`** — **MANDATORY.** Run this on all Svelte code blocks before presenting them. Repeat until 0 issues remain.

### Context7 MCP

Use Context7 for documentation grounding on the core stack. When looking up docs, use these library IDs:

- `/sveltejs/svelte` (Svelte 5 / Runes)
- `/sveltejs/kit`
- `/tailwindlabs/tailwindcss`
- `/huntabyte/bits-ui`
- `/huntabyte/shadcn-svelte`
- `/arktypeio/arktype`
- `/microsoft/typescript`

## Common Workflows

- **New Form**: Define ArkType schema -> Initialize with `prepareForm()` -> Use `Form` + Field components.
- **New Field**: Extend existing fields or use `IconInputWrapper` for consistent styling.
