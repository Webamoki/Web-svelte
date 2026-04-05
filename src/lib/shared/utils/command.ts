// Client side handling

import type { RemoteCommand } from '@sveltejs/kit';

import { toast } from 'svelte-sonner';

import type { CommandResult, CommandSuccess, ResponseError } from './remote.js';

export class CommandAction<S, O extends CommandSuccess> {
  input: Parameters<RemoteCommand<S, Promise<CommandResult<O>>>>[0] = $state()!;

  get submitting(): boolean {
    return this.#submitCount > 0;
  }

  #onError: ((error: ResponseError) => void) | undefined;
  #onSuccess: ((result: O) => void) | undefined;
  #remote: RemoteCommand<S, Promise<CommandResult<O>>>;
  #submitCount = $state(0);
  #toastError: boolean;
  #toastSuccess: boolean;

  constructor(
    remote: RemoteCommand<S, Promise<CommandResult<O>>>,
    defaultInput: Parameters<RemoteCommand<S, Promise<CommandResult<O>>>>[0],
    config?: {
      onError?: (error: ResponseError) => void;
      onSuccess?: (result: O) => void;
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

  async execute(): Promise<O> {
    this.#submitCount++;
    try {
      const result = await this.#remote(this.input);
      if (result.ok) {
        if (this.#toastSuccess) toast.success(result.value.message);
        this.#onSuccess?.(result.value);
        return result.value;
      } else {
        if (this.#toastError) toast.error(`${result.error.code} - ${result.error.message}`);
        this.#onError?.(result.error);
        throw result.error;
      }
    } finally {
      this.#submitCount--;
    }
  }
}
