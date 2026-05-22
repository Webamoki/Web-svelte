import type { Result } from '../functional/result.js';

export type FormError = {
  message: string;
  status: number;
};
export type FormResult<T> = Result<{ data: T; message?: string }, FormError>;

/** Utility functions to return form responses */
export const FormResult = {
  /** Returns a form response with a error message */
  errMsg(status: number, message: string): FormResult<never> {
    return {
      error: {
        message,
        status
      },
      ok: false
    };
  },

  /** Returns a form success with no message */
  ok(): FormResult<void> {
    return {
      ok: true,
      value: {
        data: undefined
      }
    };
  },

  /** Returns a form success with a message */
  okMsg(message: string): FormResult<void> {
    return {
      ok: true,
      value: {
        data: undefined,
        message
      }
    };
  },

  /** Returns a form success with a message and data */
  okData<T>(value: { data: T; message?: string }): FormResult<T> {
    return {
      ok: true,
      value
    };
  }
};
