// Client side handling

import type { RemoteCommand } from '@sveltejs/kit';

import { ResponseResult } from './remote.js';

export class CommandAction<S, O> {
  get submitting(): boolean {
    return this.#submitCount > 0;
  }

  #remote: RemoteCommand<S, Promise<ResponseResult<O>>>;
  #submitCount = $state(0);

  constructor(remote: RemoteCommand<S, Promise<ResponseResult<O>>>) {
    this.#remote = remote;
  }

  async execute(input: Parameters<RemoteCommand<S, Promise<ResponseResult<O>>>>[0]): Promise<O> {
    this.#submitCount++;
    try {
      const result = await this.#remote(input);
      return ResponseResult.unwrap(result);
    } finally {
      this.#submitCount--;
    }
  }
}
