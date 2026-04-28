import { getRequestEvent } from '$app/server';
import { env as dynamicEnv } from '$env/dynamic/private';
import { type ZodObject, type ZodRawShape, z } from 'zod/v4';

type SecretBinding = { get(): Promise<string | null> };
type PlatformEnv = Record<string, string | SecretBinding | undefined>;

function makePrivate<L extends ZodRawShape, S extends ZodRawShape>(
  localSchema: ZodObject<L>,
  sharedSchema: ZodObject<S>
) {
  type Result = z.infer<ZodObject<L>> & z.infer<ZodObject<S>>;
  let _cached: Result | undefined;

  return async (): Promise<Result> => {
    if (_cached) return _cached;

    const localKeys = Object.keys(localSchema.shape);
    const sharedKeys = Object.keys(sharedSchema.shape);
    const raw: Record<string, string | undefined> = {};

    let platformEnv: PlatformEnv | undefined;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      platformEnv = (getRequestEvent().platform as any)?.env as PlatformEnv | undefined;
    } catch {
      // Outside request context (build, tests) — fall through to dynamicEnv
    }

    if (platformEnv) {
      for (const key of localKeys) {
        const val = platformEnv[key];
        raw[key] = typeof val === 'string' ? val : undefined;
      }
      const sharedValues = await Promise.all(
        sharedKeys.map((key) => {
          const val = platformEnv![key];
          if (val && typeof val !== 'string' && 'get' in val) return val.get();
          return Promise.resolve(typeof val === 'string' ? val : undefined);
        })
      );
      for (let i = 0; i < sharedKeys.length; i++) {
        raw[sharedKeys[i]] = sharedValues[i] ?? undefined;
      }
    } else {
      const fallback = dynamicEnv as Record<string, string | undefined>;
      for (const key of [...localKeys, ...sharedKeys]) {
        raw[key] = fallback[key];
      }
    }

    const result = localSchema.merge(sharedSchema).safeParse(raw);
    if (!result.success) {
      const missing = result.error.issues.map((i) => i.path.join('.')).join(', ');
      throw new Error(`Missing required environment variables: ${missing}`);
    }
    _cached = result.data as Result;
    return _cached;
  };
}

export const Env = { makePrivate };
