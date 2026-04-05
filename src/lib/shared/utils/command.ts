// Client side handling

import type { RemoteCommand } from '@sveltejs/kit';

import { toast } from 'svelte-sonner';

import type { CommandResult, CommandSuccess, ResponseError } from './remote.js';

export class CommandAction<S, O extends CommandSuccess> {
  get submitting(): boolean {
    return this.#submitCount > 0;
  }

  #remote: RemoteCommand<S, Promise<CommandResult<O>>>;
  #submitCount = $state(0);
  #toastError: boolean;
  #toastSuccess: boolean;

  constructor(
    remote: RemoteCommand<S, Promise<CommandResult<O>>>,
    config?: {
      toastError?: boolean;
      toastSuccess?: boolean;
    }
  ) {
    this.#remote = remote;
    this.#toastError = config?.toastError ?? false;
    this.#toastSuccess = config?.toastSuccess ?? false;
  }

  async execute(input: Parameters<RemoteCommand<S, Promise<CommandResult<O>>>>[0]): Promise<O> {
    this.#submitCount++;
    try {
      const result = await this.#remote(input);
      if (result.ok) {
        if (this.#toastSuccess) toast.success(result.value.message);
        return result.value;
      } else {
        if (this.#toastError) toast.error(`${result.error.code} - ${result.error.message}`);
        throw result.error;
      }
    } finally {
      this.#submitCount--;
    }
  }
}
