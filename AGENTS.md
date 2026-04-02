# AGENTS.md

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

## Agent Guidelines & Tools

1. **Svelte MCP:** Use for Svelte 5 logic, SvelteKit routing, and standard component patterns.
2. **UI Components:** Use **shadcn**, **bits-ui**, and **Tailwind CSS v4** to build/extend UI components. Shadcn components are in `src/lib/shadcn/components/ui`.
3. **Context7:** Use to fetch documentation for specific libraries:
   - `/arktype/arktype` for schema validation.
   - `/huntabyte/bits-ui` for UI primitives.
   - Find other libraries if local knowledge is limited.
4. **Type Safety:** Always use **ArkType** for runtime validation and type definitions.
5. **Consistency:** Follow existing patterns in `src/lib/shared/components/form` for new fields.

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

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
- `form`: `prepareForm`, `VirtualForm`.
- `email`: AWS SES via Web Crypto API.
- `search`: Fuzzy search and highlighting.

## Common Workflows

- **New Form**: Define ArkType schema -> Initialize with `prepareForm()` -> Use `Form` + Field components.
- **New Field**: Extend existing fields or use `IconInputWrapper` for consistent styling.
