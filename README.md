# Web-Svelte

A shared Svelte UI components and utilities library.
Managed via Git Submodules and PNPM Workspaces.

## 🚀 Setup

### 1. Add as Git Submodule

If you are adding this library to a new project for the first time, run the
following command from your project root:

```bash
git submodule add git@github.com:Webamoki/Web-svelte.git modules/web-svelte
```

> [!NOTE]
> If you want, you can change the `modules/web-svelte` path, don't forget to change
> this in the rest of the setup.

> [!IMPORTANT]
> **If you have just cloned a project that already contains this submodule**, the
> folder will be empty by default. Run this to fetch the code:
>
> ```bash
> git submodule update --init --recursive
> ```

### 2. Configure PNPM Workspace

Your project must be configured as a workspace so PNPM can link the submodule.
Add (or update) the workspace file in your project root:

`pnpm-workspace.yaml`

```yaml
packages:
  - '.'
  - 'modules/*'
```

### 3. Install Dependency

Link the library to your main app as a pnpm package.
Run the following command in your project root:

```bash
pnpm add @webamoki/web-svelte@workspace:*
```

---

## 🎨 Styling

This library is built with Tailwind CSS. To ensure styles are applied correctly in your host project, follow these steps:

### Theme Configuration

Create a `theme.css` file in your project (or update your existing one) to match the variable structure found in `modules/web-svelte/src/theme.css`.

### Main CSS Setup

In your project's main CSS entry point (e.g., `src/app.css`), include the following:

```css
@import 'tailwindcss';
@import './theme.css';

/* Required for the library's dark mode components */
@custom-variant dark (&:is(.dark *));
```

---

## 🛠 Development Workflow

### Updating the Library

To pull the latest changes from the remote repository into your local submodule:

```bash
git submodule update --remote --merge
```

You will notice a git diff in your main project showing the submodule pointer
(commit hash) has changed.
Commit and push these changes to update the submodule pointer in your main project.

### Making Changes

Since this is a workspace, you can edit code inside `modules/web-svelte` directly
and have hot-reloading.

### Versioning & Releases

We use **GitHub Run Numbers** for versioning. Every merge to `main`
automatically generates a new Release tag (e.g., `v1`, `v2`).

Check the [Releases](https://github.com/Webamoki/Web-svelte/releases) tab for
auto-generated changelogs based on Pull Request titles.
