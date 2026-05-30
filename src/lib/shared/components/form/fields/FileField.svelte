<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';

  import Upload from '@lucide/svelte/icons/upload';
  import FieldLabel from '../FieldLabel.svelte';

  type LooseField = {
    as(type: string): { [k: string]: unknown; name: string };
    issues(): Array<{ message: string; path: Array<number | string> }> | undefined;
  };

  interface Props {
    accept?: string;
    children?: Snippet;
    disabled?: boolean;
    form: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    multiple?: boolean;
    name: keyof Input & string;
    onSelect?: (files: File[]) => void;
    required?: boolean;
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
    required,
    variant = 'button'
  }: Props = $props();

  const field = $derived((form.fields as Record<string, LooseField>)[name]);
  const attrs = $derived(field.as('file'));

  let input = $state<HTMLInputElement>();
  let files = $state<File[]>([]);
  let dragging = $state(false);

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

  {#each field.issues() ?? [] as issue (`${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
