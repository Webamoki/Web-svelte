<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';
  import type { ZodType } from 'zod/v4';

  import Upload from '@lucide/svelte/icons/upload';

  import { createFormView, createLocalFileView, type FieldView } from '../field-view.svelte.js';
  import FieldLabel from '../FieldLabel.svelte';

  interface Props {
    accept?: string;
    children?: Snippet;
    disabled?: boolean;
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    multiple?: boolean;
    name: keyof Input & string;
    onSelect?: (files: File[]) => void;
    optional?: boolean;
    schema?: ZodType;
    variant?: 'button' | 'dropzone';
  }

  let {
    accept,
    children,
    disabled = false,
    form,
    multiple = false,
    name,
    onSelect,
    optional,
    schema,
    variant = 'button'
  }: Props = $props();

  let input = $state<HTMLInputElement>();
  let files = $state<File[]>([]);
  let dragging = $state(false);

  // `as('file')` is reached only via the `form` branch; standalone validates the
  // selected files against the optional schema.
  // svelte-ignore state_referenced_locally
  const view: FieldView = form
    ? createFormView(form, name, 'file')
    : createLocalFileView({ get: () => files, name, schema });

  const attrs = $derived(view.attrs);
  // required drives only the label asterisk here — the native `required` attribute is
  // intentionally omitted from the file input (it blocks edit-form submits; see Zod validation).
  const required = $derived(!optional);

  const label = $derived(
    files.length === 0
      ? 'No file chosen'
      : files.length === 1
        ? files[0].name
        : `${files.length} files selected`
  );

  function sync() {
    files = input?.files ? Array.from(input.files) : [];
    onSelect?.(files);
  }

  function open() {
    if (!disabled) input?.click();
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    if (!disabled) dragging = true;
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    dragging = false;
    if (disabled || !input || !e.dataTransfer) return;
    input.files = e.dataTransfer.files;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    sync();
  }
</script>

<div class="form-field">
  {#if children}
    <FieldLabel for={attrs.name} {required}>{@render children()}</FieldLabel>
  {/if}

  <input
    bind:this={input}
    id={attrs.name}
    class="form-file-input"
    {accept}
    {disabled}
    {multiple}
    {...attrs}
    onchange={sync}
  />

  {#if variant === 'dropzone'}
    <div
      class={[
        'form-file-dropzone',
        dragging && 'form-file-dropzone--over',
        disabled && 'form-file-dropzone--disabled'
      ]
        .filter(Boolean)
        .join(' ')}
      onclick={open}
      ondragleave={() => (dragging = false)}
      ondragover={onDragOver}
      ondrop={onDrop}
      onkeydown={onKey}
      role="button"
      tabindex={disabled ? -1 : 0}
    >
      <Upload class="form-file-dropzone-icon" />
      <span class="form-file-dropzone-text">Drag &amp; drop or click to upload</span>
      <span class="form-file-name">{label}</span>
    </div>
  {:else}
    <div class="form-file-button-row">
      <button class="btn ghost" {disabled} onclick={open} type="button">
        <Upload class="form-file-button-icon" />
        Choose file{multiple ? 's' : ''}
      </button>
      <span class="form-file-name">{label}</span>
    </div>
  {/if}

  {#each view.issues() as issue (`${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
