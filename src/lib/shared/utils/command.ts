// Client side handling

import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { RemoteCommand } from '@sveltejs/kit';

import { toast } from 'svelte-sonner';

import type { CommandResult, CommandSuccess, ResponseError } from './remote.js';

import { Result } from './functional/result.js';

type RC<Schema extends StandardSchemaV1, O extends CommandSuccess> = RemoteCommand<
  StandardSchemaV1.InferInput<Schema>,
  Promise<CommandResult<O>>
>;
type RCInput<Schema extends StandardSchemaV1> = StandardSchemaV1.InferOutput<Schema>;

/**
 * Command Remote function handler for Client
 * - state for dynamic input
 * - execute function, which handles toast and callbacks
 * - submitting state for tracking pending executions
 */
export class CommandAction<Schema extends StandardSchemaV1, O extends CommandSuccess> {
  input: RCInput<Schema> = $state()!;

  get submitting(): boolean {
    return this.#submitCount > 0;
  }

  #onError: ((error: ResponseError) => void) | undefined;
  #onSuccess: ((state: { input: RCInput<Schema>; result: O }) => void) | undefined;
  #remote: RC<Schema, O>;
  #submitCount = $state(0);
  #toastError: boolean;
  #toastSuccess: boolean;

  constructor(
    remote: RC<Schema, O>,
    defaultInput: RCInput<Schema>,
    config?: {
      onError?: (error: ResponseError) => void;
      onSuccess?: (state: { input: RCInput<Schema>; result: O }) => void;
      toastError?: boolean;
      toastSuccess?: boolean;
    }
  ) {
    this.input = defaultInput;
    this.#remote = remote;
    this.#toastError = config?.toastError ?? true;
    this.#toastSuccess = config?.toastSuccess ?? true;
    this.#onError = config?.onError;
    this.#onSuccess = config?.onSuccess;
  }

  async execute(): Promise<void> {
    this.#submitCount++;
    try {
      const input = this.input;
      const result: CommandResult<O> = await this.#remote(input).catch(() =>
        Result.err({ code: 500, message: 'Internal Server Error' })
      );

      if (result.ok) {
        if (this.#toastSuccess) toast.success(result.value.message);
        this.#onSuccess?.({
          input: input,
          result: result.value
        });
        return;
      } else {
        if (this.#toastError) toast.error(`${result.error.code} - ${result.error.message}`);
        this.#onError?.(result.error);
      }
    } finally {
      this.#submitCount--;
    }
  }
}

type RCV<O extends CommandSuccess> = RemoteCommand<void, Promise<CommandResult<O>>>;

/**
 * Command Remote function handler for Client without input
 * - state for dynamic input
 * - execute function, which handles toast and callbacks
 * - submitting state for tracking pending executions
 */
export class CommandActionVoid<O extends CommandSuccess> {
  get submitting(): boolean {
    return this.#submitCount > 0;
  }

  #onError: ((error: ResponseError) => void) | undefined;
  #onSuccess: ((result: O) => void) | undefined;
  #remote: RCV<O>;
  #submitCount = $state(0);
  #toastError: boolean;
  #toastSuccess: boolean;

  constructor(
    remote: RCV<O>,
    config?: {
      onError?: (error: ResponseError) => void;
      onSuccess?: (result: O) => void;
      toastError?: boolean;
      toastSuccess?: boolean;
    }
  ) {
    this.#remote = remote;
    this.#toastError = config?.toastError ?? true;
    this.#toastSuccess = config?.toastSuccess ?? true;
    this.#onError = config?.onError;
    this.#onSuccess = config?.onSuccess;
  }

  async execute(): Promise<void> {
    this.#submitCount++;
    try {
      const result: CommandResult<O> = await this.#remote().catch(() =>
        Result.err({ code: 500, message: 'Internal Server Error' })
      );

      if (result.ok) {
        if (this.#toastSuccess) toast.success(result.value.message);
        this.#onSuccess?.(result.value);
        return;
      } else {
        if (this.#toastError) toast.error(`${result.error.code} - ${result.error.message}`);
        this.#onError?.(result.error);
      }
    } finally {
      this.#submitCount--;
    }
  }
}
