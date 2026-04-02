export type Result<T, E> =
  | {
      error: E;
      ok: false;
    }
  | {
      ok: true;
      value: T;
    };

export const Result = {
  /**
   * Creates a failed result with the given error.
   */
  err<E>(error: E): { error: E; ok: false } {
    return { error, ok: false };
  },

  /**
   * Creates a successful result with the given value.
   */
  ok<T>(value: T): { ok: true; value: T } {
    return { ok: true, value };
  },

  /**
   * Returns true if the result is Ok.
   */
  isOk<T, E>(result: Result<T, E>): result is { ok: true; value: T } {
    return result.ok;
  },

  /**
   * Returns true if the result is Err.
   */
  isErr<T, E>(result: Result<T, E>): result is { error: E; ok: false } {
    return !result.ok;
  },

  /**
   * Returns the contained Ok value or a provided default.
   */
  unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
    if (result.ok) return result.value;
    return defaultValue;
  },

  /**
   * Returns the contained Ok value or computes it from the provided op.
   * @param op - Computes value in error case or throws an error.
   */
  unwrapOrElse<T, E>(result: Result<T, E>, op: (error: E) => T): T {
    if (result.ok) return result.value;
    return op(result.error);
  },

  /**
   * Maps a Result<T, E> to Result<U, E> by applying a function to a contained Ok value,
   * leaving an Err value untouched.
   */
  map<T, U, E>(result: Result<T, E>, fn: (val: T) => U): Result<U, E> {
    if (result.ok) return Result.ok(fn(result.value));
    return result;
  },

  /**
   * Maps a Result<T, E> to Result<T, F> by applying a function to a contained Err value,
   * leaving an Ok value untouched.
   */
  mapErr<T, E, F>(result: Result<T, E>, fn: (err: E) => F): Result<T, F> {
    if (!result.ok) return Result.err(fn(result.error));
    return result;
  },

  /**
   * Calls op if the result is Ok, otherwise returns the Err value of self.
   * This function can be used for control flow based on Result values.
   */
  andThen<T, U, E>(result: Result<T, E>, op: (val: T) => Result<U, E>): Result<U, E> {
    if (result.ok) return op(result.value);
    return result;
  },

  /**
   * Calls op if the result is Err, otherwise returns the Ok value of self.
   */
  orElse<T, E, F>(result: Result<T, E>, op: (err: E) => Result<T, F>): Result<T, F> {
    if (!result.ok) return op(result.error);
    return result;
  },

  /**
   * Pattern matches the Result and returns the result of the corresponding arm.
   */
  match<T, E, R>(result: Result<T, E>, arms: { err: (err: E) => R; ok: (val: T) => R }): R {
    if (result.ok) return arms.ok(result.value);
    return arms.err(result.error);
  }
};
