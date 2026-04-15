# Web-Svelte

[![npm version](https://img.shields.io/npm/v/@webamoki/web-svelte.svg)](https://www.npmjs.com/package/@webamoki/web-svelte)

A shared Svelte UI components and utilities library.

## 🚀 Setup

### 1. Install Dependency

Install the library in your project via your preferred package manager:

```bash
pnpm add @webamoki/web-svelte
```

### 2. 🎨 Styling

This library is built with Tailwind CSS. To ensure styles are applied correctly in your host project, follow these steps:

### Theme Configuration

Create a `theme.css` file in your project (or update your existing one) to match the CSS variables required by the library's theme.

### Main CSS Setup

In your project's main CSS entry point (e.g., `src/app.css`), include the following. Crucially, you must add the `@source` directive so Tailwind v4 scans the installed library's components for utility classes.

```css
@import 'tailwindcss';
@import './theme.css';

/* Tell Tailwind to scan the library for classes */
@source '../node_modules/@webamoki/web-svelte';

/* Required for the library's dark mode components */
@custom-variant dark (&:is(.dark *));
```

> [!NOTE]
> Adjust the relative path in `@source` if your `app.css` is deeply nested, e.g., `../../node_modules/...`.

---

## 🛠 Local Development

If you want to make changes to `@webamoki/web-svelte` and test them in a host application simultaneously without publishing:

1. Clone this repository:
   ```bash
   git clone git@github.com:Webamoki/Web-svelte.git
   cd Web-svelte
   pnpm install
   ```
2. In your host application, link the local package:
   ```json
   {
     "dependencies": {
       "@webamoki/web-svelte": "file:../Web-svelte"
     }
   }
   ```
3. Run pnpm install:
   ```bash
   pnpm install
   ```
4. Run the package watcher in the library directory to automatically rebuild on changes:
   ```bash
   pnpm watch
   ```

Alternatively, to develop and test components in isolation, you can use the built-in SvelteKit app:

```bash
pnpm dev
```

---

## 🔖 Versioning & Releases

We use **Semantic Versioning** managed automatically by `semantic-release`.

Every merge to `main` is automatically analysed based on each commit message to determine the correct version bump, generate a GitHub Release and publish the package to npm.

- **Patch Release (`v0.0.X`)**: Minor tweaks that should not affect API
- **Minor Release (`v0.X.0`)**: New features added in a backwards-compatible manner
- **Major Release (`vX.0.0`)**: Any commit that makes breaking API changes

If there are multiple version bumps triggered, only the highest one will take effect (major > minor > patch).

Any commit causing a version bump will be displayed in the final release notes.

### Commit Signature

```
type(scope): subject

footer
```

### Standard Types

If a commit has any of these types, they cause a version bump:

- **Patch**: `fix|refactor|perf|build`
- **Minor**: `feat`

Other types not mentioned above will not trigger a version bump.

### Scope

If the commit has any of `major|minor|patch` in its scope, then it triggers a version bump regardless of its type.

### Versioning Examples:

```
refactor(ui): a function   // patch - standard type
fix: a bug                 // patch - standard type
fix(minor): a bug          // minor - scope overrides type
chore: comment typo        // No versioning - not a standard type
chore(major): something    // major - scope overrides type
ci: blah                   // No versioning - not standard
```

### Breaking Changes

Commits with a breaking change automatically trigger a `major` version bump.

For breaking changes, you must append `!` before the colon in the commit header as such:

```
refactor!: change api
fix(ui)!: change button api
```

Breaking changes will be displayed separately in the release notes.
If you want to give more detail for a breaking commit, add messages in the footer following these templates:

```
refactor!: change api

BREAKING CHANGE: Remove endpoint for auth
```

```
fix(ui)!: change button api

BREAKING CHANGES: button api
- Remove content prop
- Add colour prop
```
