import type { Type } from 'arktype';

import { dateTransport } from '$lib/shared/utils/datetime/index.js';
import { superValidate } from 'sveltekit-superforms';
import { arktype } from 'sveltekit-superforms/adapters';

export async function processForm<S extends Type<Record<string, unknown>>>(
  request: Request,
  schema: S
) {
  return await superValidate(request, arktype(schema), { transport: dateTransport });
}
