import type { StandardSchemaV1 } from '@standard-schema/spec';

import { command, form, query } from '$app/server';
import {
  error,
  type InvalidField,
  type RemoteCommand,
  type RemoteForm,
  type RemoteFormInput,
  type RemoteQueryFunction
} from '@sveltejs/kit';

import { Result } from './functional/index.js';

export type CheckFunction = () => Promise<CheckResult>;
export type CheckResult = Result<void, ResponseError>;
export const CheckResult = {
  /* Helper function for ok check result. */
  ok(): { ok: true; value: void } {
    return Result.ok(undefined) satisfies CheckResult;
  }
};

export type ResponseError = {
  code: number;
  message: string;
};
export type ResponseResult<T> = Result<T, ResponseError>;
export const ResponseResult = {
  /**
   * Unwraps a ResponseResult, throwing a sveltekit error if it is an error result.
   */
  unwrap<T>(result: ResponseResult<T>): T {
    return Result.unwrapOrElse(result, (err) => error(err.code, err.message));
  }
};

/* Guards command remote function with a check function. */
export function guardedCommand<Schema extends StandardSchemaV1, Output>(
  check: CheckFunction,
  schema: Schema,
  fn: (output: StandardSchemaV1.InferOutput<Schema>) => Promise<ResponseResult<Output>>
): RemoteCommand<StandardSchemaV1.InferInput<Schema>, Promise<ResponseResult<Output>>> {
  return command(schema, async (output) => {
    const outcome = await check();
    // Command remote functions cannot redirect for error,
    //   so return result object.
    if (!outcome.ok) return Result.err(outcome.error);
    return await fn(output);
  });
}

/* Guards input-less command remote function with a check function. */
export function guardedCommandVoid<Output>(
  check: CheckFunction,
  fn: () => Promise<ResponseResult<Output>>
): RemoteCommand<void, Promise<ResponseResult<Output>>> {
  return command(async () => {
    const outcome = await check();
    if (!outcome.ok) return Result.err(outcome.error);
    return await fn();
  });
}

/* Guards form remote function with a check function. */
export function guardedForm<
  Schema extends StandardSchemaV1<RemoteFormInput, Record<string, unknown>>,
  Output
>(
  schema: Schema,
  check: CheckFunction,
  fn: (
    output: StandardSchemaV1.InferOutput<Schema>,
    issue: InvalidField<StandardSchemaV1.InferInput<Schema>>
  ) => Promise<Output>
): RemoteForm<StandardSchemaV1.InferInput<Schema>, Output> {
  return form(schema, async (output, issue) => {
    // Enforce auth check or throw sveltekit error
    ResponseResult.unwrap(await check());
    return await fn(output, issue);
  });
}

/* Guards input-less form remote function with a check function. */
export function guardedFormVoid<Output>(
  check: CheckFunction,
  fn: () => Promise<Output>
): RemoteForm<void, Output> {
  return form(async () => {
    // Enforce auth check or throw sveltekit error
    ResponseResult.unwrap(await check());
    return await fn();
  });
}

/* Guards query remote function with a check function. */
export function guardedQuery<Schema extends StandardSchemaV1, Output>(
  check: CheckFunction,
  schema: Schema,
  fn: (output: StandardSchemaV1.InferOutput<Schema>) => Promise<Output>
): RemoteQueryFunction<StandardSchemaV1.InferInput<Schema>, Output> {
  return query(schema, async (output) => {
    // Enforce auth check or throw sveltekit error
    ResponseResult.unwrap(await check());
    return await fn(output);
  });
}

/* Guards input-less query remote function with a check function. */
export function guardedQueryVoid<Output>(
  check: CheckFunction,
  fn: () => Promise<Output>
): RemoteQueryFunction<void, Output> {
  return query(async () => {
    // Enforce auth check or throw sveltekit error
    ResponseResult.unwrap(await check());
    return await fn();
  });
}
