# Web-Svelte

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

## 🛠 Development Workflow

### Local Development

If you want to make changes to `@webamoki/web-svelte` and test them in a host application simultaneously without publishing:

1. Clone this repository:
   ```bash
   git clone git@github.com:Webamoki/Web-svelte.git
   cd Web-svelte
   pnpm install
   ```
2. Link the package globally:
   ```bash
   pnpm link --global
   ```
3. In your host application, link the local package:
   ```bash
   pnpm link --global @webamoki/web-svelte
   ```
4. Run the package watcher in the library directory to automatically rebuild on changes:
   ```bash
   pnpm watch
   ```

Alternatively, to develop and test components in isolation, you can use the built-in SvelteKit app:

```bash
pnpm dev
```

### Versioning & Releases

We use **Semantic Versioning** managed automatically by `semantic-release`.

Every merge to `main` is automatically analyzed based on the
**[Angular commit message format](https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md)**
to determine the correct version bump, generate a changelog, create a GitHub Release,
and publish the package to npm with OIDC provenance.

- **Patch Release (`v1.0.x`)**: `fix:`, `perf:`, etc. (Bug fixes, minor tweaks)
- **Minor Release (`v1.x.0`)**: `feat:` (New features added in a backwards-compatible manner)
- **Major Release (`vX.0.0`)**: Any commit that includes `BREAKING CHANGE:` in its footer.
