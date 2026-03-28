export type Result<T, E> =
  | {
      error: E;
      ok: false;
    }
  | {
      ok: true;
      value: T;
    };

export function err<E>(error: E): { error: E; ok: false } {
  return { error, ok: false };
}

export function ok<T>(value: T): { ok: true; value: T } {
  return { ok: true, value };
}
