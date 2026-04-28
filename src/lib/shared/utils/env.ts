import type { ZodObject, ZodRawShape } from 'zod/v4';

import { env as dynamicEnv } from '$env/dynamic/public';

function makePublic<S extends ZodRawShape>(schema: ZodObject<S>) {
  type Result = ReturnType<typeof schema.parse>;
  let _cached: Result | undefined;

  return (): Result => {
    if (_cached) return _cached;

    const result = schema.safeParse(dynamicEnv);
    if (!result.success) {
      const missing = result.error.issues.map((i) => i.path.join('.')).join(', ');
      throw new Error(`Missing required environment variables: ${missing}`);
    }
    _cached = result.data;
    return _cached;
  };
}

export const Env = { makePublic };
