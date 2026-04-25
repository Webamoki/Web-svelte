import type { z } from 'zod/v4';

import { dateTransport } from '$lib/shared/utils/datetime/index.js';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export async function processForm<S extends z.ZodType<Record<string, unknown>>>(
  request: Request,
  schema: S
) {
  return await superValidate(request, zod4(schema), { transport: dateTransport });
}
