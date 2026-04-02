import { fail, message as superFormMessage, type SuperValidated } from 'sveltekit-superforms';
export function errorMessage<T extends Record<string, unknown>>(
  form: SuperValidated<T>,
  options?: { data?: unknown; showToast?: boolean; text?: string }
) {
  const message = {
    data: options?.data,
    showToast: options?.showToast ?? false,
    success: false,
    text: options?.text
  } as App.Superforms.Message;
  return superFormMessage(form, message);
}

export function failFormValidation<T extends Record<string, unknown>>(form: SuperValidated<T>) {
  if (form.valid) throw new Error('Invalid form passed');
  return fail(400, { form });
}

/**
 * automatically handle database errors from catch.
 * used in form/action handling in page.server.ts
 */
export function handleDbErrorForm<T extends Record<string, unknown>>(
  form: SuperValidated<T>,
  message: string,
  err: unknown
) {
  // if (err instanceof DatabaseError) {
  // 	console.error(`Database Error ${message}:`, err);
  // 	return fail(500, { form });
  // }
  console.error(`Unexpected Error ${message}:`, err);
  return fail(500, { form });
}

/**
 * check if an error returned by a try catch is a duplicate value error in postgre
 */
export function isDuplicateDbError(err: unknown) {
  console.error('Checking for duplicate error:', err);
  console.error('Error type:', err instanceof Error ? err.name : typeof err);
  return false;
}

export function successMessage<T extends Record<string, unknown>>(
  form: SuperValidated<T>,
  options?: { data?: unknown; showToast?: boolean; text?: string }
) {
  const message = {
    data: options?.data,
    showToast: options?.showToast ?? true,
    success: true,
    text: options?.text ?? 'Success'
  } as App.Superforms.Message;
  return superFormMessage(form as SuperValidated<T>, message);
}
