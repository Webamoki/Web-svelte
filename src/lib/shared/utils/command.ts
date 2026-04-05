// Client side handling

import type { RemoteCommand } from '@sveltejs/kit';

import { toast } from 'svelte-sonner';

import type { CommandResult, CommandSuccess, ResponseError } from './remote.js';

import { Result } from './functional/result.js';

type RC<S, O extends CommandSuccess> = RemoteCommand<S, Promise<CommandResult<O>>>;

/**
 * Command Remote function handler for Client
 * - state for dynamic input
 * - execute function, which handles toast and callbacks
 * - submitting state for tracking pending executions
 */
export class CommandAction<S, O extends CommandSuccess> {
  input: S = $state()!;

  get submitting(): boolean {
    return this.#submitCount > 0;
  }

  #onError: ((error: ResponseError) => void) | undefined;
  #onSuccess: ((state: { input: S; result: O }) => void) | undefined;
  #remote: RC<S, O>;
  #submitCount = $state(0);
  #toastError: boolean;
  #toastSuccess: boolean;

  constructor(
    remote: RC<S, O>,
    defaultInput: S,
    config?: {
      onError?: (error: ResponseError) => void;
      onSuccess?: (state: { input: S; result: O }) => void;
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

  /** Executes the command with the current input. */
  execute(): Promise<void> {
    return this.executeWith(this.input);
  }

  /** Executes the command with the provided input. */
  async executeWith(input: S): Promise<void> {
    this.#submitCount++;
    try {
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
