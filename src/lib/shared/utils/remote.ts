import type { StandardSchemaV1 } from '@standard-schema/spec';

import { command, form, query } from '$app/server';
import { Result } from '$lib/shared/utils/functional/index.js';
import {
  error,
  type InvalidField,
  type RemoteCommand,
  type RemoteForm,
  type RemoteFormInput,
  type RemoteQueryFunction
} from '@sveltejs/kit';

export type ResponseError = {
  code: number;
  message: string;
};

export type CheckFunction = () => Promise<CheckResult>;
export type CheckResult = Result<void, ResponseError>;
export const CheckResult = {
  /* Helper function for ok check result. */
  ok(): { ok: true; value: void } {
    return Result.ok(undefined) satisfies CheckResult;
  },

  /** Throws a sveltekit error if the result is an error result. */
  enforceOk(r: CheckResult) {
    if (Result.isErr(r)) throw error(r.error.code, r.error.message);
  }
};

export type CommandResult<T extends CommandSuccess> = Result<T, ResponseError>;
export type CommandSuccess = { message: string };

/* Guards command remote function with a check function. */
export function guardedCommand<Schema extends StandardSchemaV1, Output extends CommandSuccess>(
  check: CheckFunction,
  schema: Schema,
  fn: (output: StandardSchemaV1.InferOutput<Schema>) => Promise<CommandResult<Output>>
): RemoteCommand<StandardSchemaV1.InferInput<Schema>, Promise<CommandResult<Output>>> {
  return command(schema, async (output) => {
    const outcome = await check();
    // Command remote functions cannot redirect for error,
    //   so return result object.
    if (!outcome.ok) return Result.err(outcome.error);
    return await fn(output);
  });
}

/* Guards input-less command remote function with a check function. */
export function guardedCommandVoid<Output extends CommandSuccess>(
  check: CheckFunction,
  fn: () => Promise<CommandResult<Output>>
): RemoteCommand<void, Promise<CommandResult<Output>>> {
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
    CheckResult.enforceOk(await check());
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
    CheckResult.enforceOk(await check());
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
    CheckResult.enforceOk(await check());
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
    CheckResult.enforceOk(await check());
    return await fn();
  });
}
