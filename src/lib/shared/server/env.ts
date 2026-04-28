import type { z, ZodObject, ZodRawShape } from 'zod/v4';

import { getRequestEvent } from '$app/server';
import { env as dynamicEnv } from '$env/dynamic/private';

type PlatformEnv = Record<string, SecretBinding | string | undefined>;
type SecretBinding = { get(): Promise<null | string> };

function makePrivate<S extends ZodRawShape>(schema: ZodObject<S>) {
  type Result = z.infer<ZodObject<S>>;
  let _cached: Result | undefined;

  return async (): Promise<Result> => {
    if (_cached) return _cached;

    const keys = Object.keys(schema.shape);
    const raw: Record<string, string | undefined> = {};

    let platformEnv: PlatformEnv | undefined;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      platformEnv = (getRequestEvent().platform as any)?.env as PlatformEnv | undefined;
    } catch {
      // Outside request context (build, tests) — fall through to dynamicEnv
    }

    if (platformEnv) {
      const values = await Promise.all(
        keys.map((key) => {
          const val = platformEnv![key];
          if (val && typeof val === 'object' && 'get' in val && typeof val.get === 'function')
            return val.get();
          return Promise.resolve(typeof val === 'string' ? val : undefined);
        })
      );
      for (let i = 0; i < keys.length; i++) {
        raw[keys[i]] = values[i] ?? undefined;
      }
    } else {
      const fallback = dynamicEnv as Record<string, string | undefined>;
      for (const key of keys) {
        raw[key] = fallback[key];
      }
    }

    const result = schema.safeParse(raw);
    if (!result.success) {
      throw new Error(
        `Environment validation failed: ${result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`
      );
    }
    _cached = result.data as Result;
    return _cached;
  };
}

export const Env = { makePrivate };
