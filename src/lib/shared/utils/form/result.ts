export type FormResponseType = 'error' | 'ok' | 'warning';
export type FormResult<T> = {
  data: T;
  message?: string;
  type: FormResponseType;
};

/** Utility functions to return form responses */
export const FormResult = {
  /** Returns a form error with data and a message */
  errData<T>(info: { data: T; message?: string }): FormResult<T> {
    return {
      ...info,
      type: 'error'
    };
  },

  /** Returns a form error with a message */
  err(message: string): FormResult<void> {
    return {
      data: undefined,
      message,
      type: 'error'
    };
  },

  /** Returns a form warning with data and a message */
  warnData<T>(info: { data: T; message?: string }): FormResult<T> {
    return {
      ...info,
      type: 'warning'
    };
  },

  /** Returns a form warning with a message */
  warn(message: string): FormResult<void> {
    return {
      data: undefined,
      message,
      type: 'warning'
    };
  },

  /** Returns a form ok with data and a message */
  okData<T>(info: { data: T; message?: string }): FormResult<T> {
    return {
      ...info,
      type: 'ok'
    };
  },

  /** Returns a form ok with a message */
  ok(message: string): FormResult<void> {
    return {
      data: undefined,
      message,
      type: 'ok'
    };
  }
};
