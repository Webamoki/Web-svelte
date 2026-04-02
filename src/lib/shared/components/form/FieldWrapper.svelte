<script lang="ts" module>
  export interface FieldWrapperProps<T extends Record<string, unknown>, U extends FormPath<T>, M> {
    class?: string;
    description?: string;
    form: FsSuperForm<T, M>;
    label?: string;
    name: U;
  }

  export interface FormAttrs extends ControlAttrs {
    disabled?: HTMLInputAttributes['disabled'];
    readonly?: HTMLInputAttributes['readonly'];
  }
</script>

<script generics="T extends Record<string, unknown>, U extends FormPath<T>, M" lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type { FormPath } from 'sveltekit-superforms';

  import { cn } from '$lib/shadcn/utils.js';
  import {
    Control,
    type ControlAttrs,
    Description,
    Field,
    type FsSuperForm,
    Label
  } from 'formsnap';

  import Errors from './Errors.svelte';

  interface Props extends FieldWrapperProps<T, U, M> {
    formElem: Snippet<[ControlAttrs]>;
  }
  let { class: className, description, form, formElem, label, name }: Props = $props();
</script>

<Field {name} {form}>
  <div class={cn('space-y-1', className)}>
    <Control>
      {#snippet children({ props })}
        <div class="w-full space-y-1">
          {#if label || description}
            <div>
              {#if label}
                <Label class="mb-2 text-sm font-medium">
                  {label}
                  {#if props['aria-required'] === 'true'}
                    <span class="text-red-500">*</span>
                  {/if}
                </Label>
              {/if}
              {#if description}
                <Description class="mb-2 text-sm font-medium">{description}</Description>
              {/if}
            </div>
          {/if}
          {@render formElem(props)}
        </div>
      {/snippet}
    </Control>

    <Errors />
  </div>
</Field>
