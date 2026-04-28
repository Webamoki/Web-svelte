import type { ZodObject, ZodRawShape } from 'zod/v4';

import { env as dynamicEnv } from '$env/dynamic/public';

function makePublic<S extends ZodRawShape>(schema: ZodObject<S>) {
  type Result = ReturnType<typeof schema.parse>;
  let _cached: Result | undefined;

  return (): Result => {
    if (_cached) return _cached;

    const result = schema.safeParse(dynamicEnv);
    if (!result.success) {
      throw new Error(
        `Environment validation failed: ${result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`
      );
    }
    _cached = result.data;
    return _cached;
  };
}

export const Env = { makePublic };
