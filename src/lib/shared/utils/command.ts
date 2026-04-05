// Client side handling

import type { RemoteCommand } from '@sveltejs/kit';

import { toast } from 'svelte-sonner';

import type { CommandResult, CommandSuccess, ResponseError } from './remote.js';

import { Result } from './functional/result.js';

/**
 * Command Remote function handler for Client
 * - state for dynamic input
 * - execute function, which handles toast and callbacks
 * - submitting state for tracking pending executions
 */
export class CommandAction<S, O extends CommandSuccess> {
  input: Parameters<RemoteCommand<S, Promise<CommandResult<O>>>>[0] = $state()!;

  get submitting(): boolean {
    return this.#submitCount > 0;
  }

  #onError: ((error: ResponseError) => void) | undefined;
  #onSuccess:
    | ((state: {
        input: Parameters<RemoteCommand<S, Promise<CommandResult<O>>>>[0];
        result: O;
      }) => void)
    | undefined;
  #remote: RemoteCommand<S, Promise<CommandResult<O>>>;
  #submitCount = $state(0);
  #toastError: boolean;
  #toastSuccess: boolean;

  constructor(
    remote: RemoteCommand<S, Promise<CommandResult<O>>>,
    defaultInput: Parameters<RemoteCommand<S, Promise<CommandResult<O>>>>[0],
    config?: {
      onError?: (error: ResponseError) => void;
      onSuccess?: (state: {
        input: Parameters<RemoteCommand<S, Promise<CommandResult<O>>>>[0];
        result: O;
      }) => void;
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
