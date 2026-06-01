<script generics="Input extends RemoteFormInput" lang="ts">
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';
  import type { ZodType } from 'zod/v4';

  import { Slider } from 'bits-ui';

  import { createFormView, createLocalSliderView, type FieldView } from '../field-view.svelte.js';
  import FieldLabel from '../FieldLabel.svelte';

  interface Props {
    children?: Snippet;
    disabled?: boolean;
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    /** Range + form mode: field name for the upper thumb. */
    highName?: keyof Input & string;
    /** Range + form mode: field name for the lower thumb. */
    lowName?: keyof Input & string;
    max?: number;
    min?: number;
    /** Single mode field name. */
    name?: keyof Input & string;
    onChange?: (value: number | number[]) => void;
    optional?: boolean;
    /** Dual-thumb range slider; `value` becomes `[low, high]`. */
    range?: boolean;
    schema?: ZodType;
    /** Show the current value next to the label (default true). */
    showValue?: boolean;
    step?: number;
    value?: number | number[];
  }

  let {
    children,
    disabled = false,
    form,
    highName,
    lowName,
    max = 100,
    min = 0,
    name,
    onChange,
    optional,
    range = false,
    schema,
    showValue = true,
    step = 1,
    value = $bindable(range ? [min, max] : min)
  }: Props = $props();

  // `as('number')` is reached only via the `form` branch; standalone uses local state.
  // The branch (single/range, form/standalone) is fixed for a field instance.
  // svelte-ignore state_referenced_locally
  const singleView: FieldView | undefined = range
    ? undefined
    : form
      ? createFormView(form, name as string, 'number')
      : createLocalSliderView<number>({
          get: () => (value as number) ?? min,
          name: (name as string) ?? 'slider',
          onChange: (v) => onChange?.(v),
          schema,
          write: (v) => (value = v)
        });
  // svelte-ignore state_referenced_locally
  const lowView: FieldView | undefined =
    range && form ? createFormView(form, lowName as string, 'number') : undefined;
  // svelte-ignore state_referenced_locally
  const highView: FieldView | undefined =
    range && form ? createFormView(form, highName as string, 'number') : undefined;
  // svelte-ignore state_referenced_locally
  const rangeLocalView: FieldView | undefined =
    range && !form
      ? createLocalSliderView<number[]>({
          get: () => (value as number[]) ?? [min, max],
          name: (lowName as string) ?? 'slider',
          onChange: (v) => onChange?.(v),
          schema,
          write: (v) => (value = v)
        })
      : undefined;

  const required = $derived(!optional);
  const labelFor = $derived((name as string) ?? (lowName as string) ?? 'slider');

  const singleValue = $derived(Number(singleView?.attrs.value ?? min));
  const rangeValue = $derived.by<number[]>(() =>
    rangeLocalView
      ? ((rangeLocalView.attrs.value as number[]) ?? [min, max])
      : [Number(lowView?.attrs.value ?? min), Number(highView?.attrs.value ?? max)]
  );

  const issues = $derived(
    range
      ? rangeLocalView
        ? rangeLocalView.issues()
        : [...(lowView?.issues() ?? []), ...(highView?.issues() ?? [])]
      : (singleView?.issues() ?? [])
  );

  function handleSingle(v: number) {
    singleView?.set(v);
  }

  function handleRange(v: number[]) {
    if (rangeLocalView) {
      rangeLocalView.set(v);
    } else {
      lowView?.set(v[0]);
      highView?.set(v[1]);
    }
  }
</script>

<div class="form-slider-wrapper">
  <div class="form-slider-row">
    {#if children}
      <FieldLabel class="form-slider-label" for={labelFor} {required}>
        {@render children()}
      </FieldLabel>
    {/if}
    {#if showValue}
      <span class="form-slider-value"
        >{range ? `${rangeValue[0]} – ${rangeValue[1]}` : singleValue}</span
      >
    {/if}
  </div>

  {#if range}
    <Slider.Root
      id={labelFor}
      class="form-slider"
      {disabled}
      {max}
      {min}
      onValueChange={handleRange}
      {step}
      type="multiple"
      value={rangeValue}
    >
      {#snippet children({ thumbs })}
        <span class="form-slider-track"><Slider.Range class="form-slider-range" /></span>
        {#each thumbs as index (index)}
          <Slider.Thumb class="form-slider-thumb" {index} />
        {/each}
      {/snippet}
    </Slider.Root>
  {:else}
    <Slider.Root
      id={labelFor}
      class="form-slider"
      {disabled}
      {max}
      {min}
      onValueChange={handleSingle}
      {step}
      type="single"
      value={singleValue}
    >
      {#snippet children({ thumbs })}
        <span class="form-slider-track"><Slider.Range class="form-slider-range" /></span>
        {#each thumbs as index (index)}
          <Slider.Thumb class="form-slider-thumb" {index} />
        {/each}
      {/snippet}
    </Slider.Root>
  {/if}

  {#if form}
    {#if range}
      <input name={lowView?.attrs.name} type="hidden" value={rangeValue[0]} />
      <input name={highView?.attrs.name} type="hidden" value={rangeValue[1]} />
    {:else}
      <input name={singleView?.attrs.name} type="hidden" value={singleValue} />
    {/if}
  {/if}

  {#each issues as issue (`${issue.path}`)}
    <p class="form-error form-error--indented">{issue.message}</p>
  {/each}
</div>
