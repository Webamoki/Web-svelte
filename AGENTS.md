# @webamoki/web-svelte

## Project Overview

This is a Svelte component library designed to accelerate SvelteKit/Svelte project development. The library provides production-ready components, utility functions, and form handling solutions.

**Package Name:** `@webamoki/web-svelte`  
**Version:** 0.7.0  
**License:** MIT

## Core Features

### 1. Form System (Primary Feature)

The library offers a comprehensive, type-safe form system powered by `sveltekit-superforms` and `arktype`:

#### Form Components

- **Form** - Main form wrapper component with built-in validation and state management
- **Button** - Form submission button with loading states
- **FieldWrapper** - Wrapper for consistent field styling and error display
- **Errors** - Error display component
- **IconInputWrapper** - Reusable wrapper for adding icons to input fields (internal component, exported for custom field creation)

#### Field Components

Rich collection of pre-built, validated field components. **All input field components support an optional `icon` prop** to display Lucide Svelte icons on the left side:

- `TextField` - Standard text input (supports `icon`, `class`, `placeholder` props)
- `TextFieldNullable` - Text input that accepts null values (supports `icon`, `class`, `placeholder` props)
- `PasswordField` - Password input with visibility toggle (supports `icon`, `class` props)
- `NumberField` - Numeric input with validation (supports `icon`, `class`, `placeholder` props)
- `DateField` - Date picker with internationalization (supports `icon`, `class` props)
- `TimeField` - Time input (supports `icon`, `class`, `placeholder` props)
- `HexColorField` - Color picker for hex values (no icon support)
- `MessageField` - Textarea for longer text (supports `icon`, `class`, `placeholder` props with top-aligned icon)
- `SelectField` - Single-select dropdown (supports `icon`, `class` props)
- `SelectMultiField` - Multi-select dropdown (supports `icon`, `class` props)
- `ChoiceField` - Radio button group (no icon support)
- `ChoiceMultiField` - Checkbox group (no icon support)
- `WeekdayChoiceField` - Weekday selector (single) (no icon support)
- `WeekdayChoiceMultiField` - Weekday selector (multiple) (no icon support)

**Icon Usage Example:**

```javascript
import { Mail } from '@lucide/svelte';
import { TextField } from '@webamoki/web-svelte/components/form';

<TextField name="email" label="Email" icon={Mail} />;
```

#### Form Utilities

Located in `./utils/form`:

- `prepareForm()` - Initialize forms with server-validated data
- `prepareEmptyForm()` - Create new forms with default values
- `VirtualForm` - Client-side form state management without server validation

#### Server Form Handlers

Located in `./server/`:

- `form-handler` - Database error handling, success/error messages
- `form-processor` - Form validation and processing utilities

### 2. UI Components

Located in `./components/ui`:

#### Selection Components

- `Choice` - Single-choice selector
- `ChoiceMulti` - Multiple-choice selector
- `WeekdayChoice` - Weekday picker (single)
- `WeekdayChoiceMulti` - Weekday picker (multiple)

#### Context Menu Components

- `ContextMenu` - Context menu container
- `ContextMenuTrigger` - Context menu trigger
- `ContextMenuContent` - Menu content wrapper
- `ContextMenuItem` - Individual menu items
- `ContextMenuSeparator` - Visual separator

#### Drag and Drop

- `DragManager` - Drag and drop state manager
- `Draggable` - Draggable element wrapper
- `Dropzone` - Drop target wrapper

#### Search

- `SearchBar` - Search input with fuzzy search integration

### 3. Utility Functions

#### Datetime (`./utils/datetime`)

Date and time manipulation with `@internationalized/date` integration

#### Email (`./utils/email`)

Email sending utilities with AWS SES integration

#### Form Utils (`./utils/form`)

Form preparation, validation, and virtual form management

#### Search (`./utils/search`)

- `fuzzySearch()` - Fuzzy string matching
- `fuzzySearchHighlight()` - Fuzzy search with highlighted results

#### String (`./utils/string`)

- `toTitleCase()` - Convert strings to title case

#### Type Utilities (`./utils/types`)

- `arktype` - ArkType type definitions and helpers
- `consts` - Shared constants and types
- `db` - Database-related type utilities

## Tech Stack

### Core Dependencies

- **svelte** ^5.43.6 - Framework
- **sveltekit-superforms** ^2.28.1 - Form handling
- **arktype** ^2.1.26 - Runtime type validation
- **bits-ui** ^2.14.3 - UI primitives
- **formsnap** ^2.0.1 - Form accessibility

### Additional Features

- **@aws-sdk/client-ses** - Email sending
- **@internationalized/date** - Date/time handling
- **drizzle-orm** - Database ORM integration
- **@lucide/svelte** - Icon library
- **svelte-sonner** - Toast notifications
- **svelte-awesome-color-picker** - Color picker

## Installation & Usage

```bash
pnpm add @webamoki/web-svelte
```

Add to your `app.css`:

```css
@source "../...path/node_modules/@webamoki/web-svelte/dist/**/*.{js,svelte,ts}";
```

## Import Paths

### Components

```javascript
import { Form, TextField, Button } from '@webamoki/web-svelte/components/form';
import { SearchBar, Choice, ContextMenu } from '@webamoki/web-svelte/components/ui';
```

### Utilities

```javascript
import { prepareForm, VirtualForm } from '@webamoki/web-svelte/utils/form';
import { fuzzySearch } from '@webamoki/web-svelte/utils/search';
import { toTitleCase } from '@webamoki/web-svelte/utils/string';
```

### Server

```javascript
import { handleDbErrorForm, successMessage } from '@webamoki/web-svelte/server/form-handler';
```

## Project Structure

```
src/lib/
├── components/
│   ├── form/           # Form components and fields
│   │   ├── fields/     # All field types
│   │   ├── Form.svelte
│   │   └── Button.svelte
│   ├── ui/             # UI components
│   │   ├── choice/     # Choice components
│   │   ├── context-menu/
│   │   ├── drag-drop/
│   │   └── search/
│   └── showcase/       # Demo/showcase components
├── utils/
│   ├── form/           # Form utilities
│   ├── datetime/       # Date/time helpers
│   ├── email/          # Email utilities
│   ├── types/          # Type definitions
│   ├── search.ts       # Search functions
│   └── string.ts       # String utilities
└── server/
    ├── form-handler.ts    # Server-side form handling
    └── form-processor.ts  # Form processing logic
```

## Key Development Patterns

### Form Workflow

1. Define schema with `arktype`
2. Server-side: Validate with `superValidated()`
3. Client-side: Initialize with `prepareForm()` or `prepareEmptyForm()`
4. Use typed field components
5. Handle success/error with built-in toast notifications

### Virtual Forms

For client-only forms without server validation:

```javascript
const virtualForm = new VirtualForm(schema);
```

### Error Handling

Server-side database errors are handled automatically:

```javascript
handleDbErrorForm(form, 'Error message', err);
```

## Agent Guidelines

When working with this codebase:

1. **Forms are the primary feature** - Most tasks will involve form components and utilities
2. **Type safety is critical** - All forms use ArkType for runtime validation
3. **Consistent patterns** - Follow existing patterns for form preparation and field usage
4. **Server/client separation** - Be aware of server utilities vs. client utilities
5. **Import paths** - Use the specific export paths defined in package.json
6. **Styling** - Components use TailwindCSS with the configured theme

## Common Tasks

- **Creating a new form**: Use `Form` component with field components and `prepareForm()`
- **Adding validation**: Define schema with `arktype` and let superforms handle it
- **Handling server errors**: Use `handleDbErrorForm()` and `successMessage()`/`errorMessage()`
- **Client-only forms**: Use `VirtualForm` class
- **String manipulation**: Use utility functions from `./utils/string`
- **Date handling**: Import from `./utils/datetime`
- **Search functionality**: Use `fuzzySearch()` from `./utils/search`
- **Creating custom field components**: Use `IconInputWrapper` to add consistent icon support

  ```javascript
  import IconInputWrapper from '@webamoki/web-svelte/components/form';

  <IconInputWrapper {icon}>
    {#snippet children({ class: iconClass })}
      <YourInput class={cn(iconClass, className)} {...props} />
    {/snippet}
  </IconInputWrapper>
  ```
