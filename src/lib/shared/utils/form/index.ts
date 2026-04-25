import type { z } from 'zod/v4';

import { toast } from 'svelte-sonner';
import { defaults, superForm, type SuperValidated } from 'sveltekit-superforms';
import { type Infer, zod4, zod4Client } from 'sveltekit-superforms/adapters';

import { dateTransport } from '../datetime/index.js';
export * from './virtual-form.js';
export function prepareEmptyForm<S extends z.ZodType<Record<string, unknown>>>(
  schema: S,
  options?: Partial<{
    invalidateAll: boolean;
    onError: (
      form: Readonly<SuperValidated<Infer<S, 'zod4'>, App.Superforms.Message, Infer<S, 'zod4'>>>
    ) => void;
    onSuccess: (
      form: Readonly<SuperValidated<Infer<S, 'zod4'>, App.Superforms.Message, Infer<S, 'zod4'>>>
    ) => void;
    onUpdated: (
      form: Readonly<SuperValidated<Infer<S, 'zod4'>, App.Superforms.Message, Infer<S, 'zod4'>>>
    ) => void;
    resetForm: boolean;
  }>
) {
  const form = superForm(defaults(zod4(schema)), {
    dataType: 'json',
    invalidateAll: options?.invalidateAll ?? false,
    onError({ result }) {
      const message = result.error.message ?? 'There was an error submitting the form';
      const status = result.status ?? 500;
      toast.error(`${status} - ${message}`);
    },
    onUpdated({ form }) {
      options?.onUpdated?.(form);
      if (form.valid && form.message!.success) {
        options?.onSuccess?.(form);
        if (form.message?.text && form.message?.showToast) {
          toast.success(form.message.text);
        }
      } else {
        options?.onError?.(form);
        if (form.message?.text && form.message?.showToast) {
          toast.error(form.message.text);
        }
      }
    },
    resetForm: options?.resetForm ?? true,
    transport: dateTransport,
    validators: zod4Client(schema)
  });
  const isProcessing = form.delayed;
  const errors = form.errors;
  return { data: form.form, errors, form, isProcessing };
}

export function prepareForm<S extends z.ZodType<Record<string, unknown>>>(
  schema: S,
  validated: Infer<S, 'zod4'> | SuperValidated<Infer<S, 'zod4'>>,
  options?: Partial<{
    invalidateAll: boolean;
    onError: (
      form: Readonly<SuperValidated<Infer<S, 'zod4'>, App.Superforms.Message, Infer<S, 'zod4'>>>
    ) => void;
    onSuccess: (
      form: Readonly<SuperValidated<Infer<S, 'zod4'>, App.Superforms.Message, Infer<S, 'zod4'>>>
    ) => void;
    onUpdated: (
      form: Readonly<SuperValidated<Infer<S, 'zod4'>, App.Superforms.Message, Infer<S, 'zod4'>>>
    ) => void;
    resetForm: boolean;
  }>
) {
  const form = superForm(validated, {
    dataType: 'json',
    invalidateAll: options?.invalidateAll ?? false,
    onError({ result }) {
      const message = result.error.message ?? 'There was an error submitting the form';
      const status = result.status ?? 500;
      toast.error(`${status} - ${message}`);
    },
    onUpdated({ form }) {
      options?.onUpdated?.(form);
      if (form.valid && form.message!.success) {
        options?.onSuccess?.(form);
        if (form.message?.text && form.message?.showToast) {
          toast.success(form.message.text);
        }
      } else {
        options?.onError?.(form);
        if (form.message?.text && form.message?.showToast) {
          toast.error(form.message.text);
        }
      }
    },
    resetForm: options?.resetForm ?? true,
    transport: dateTransport,
    validators: zod4Client(schema)
  });
  const isProcessing = form.delayed;
  const errors = form.errors;
  return { data: form.form, errors, form, isProcessing };
}
