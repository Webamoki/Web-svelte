import { type } from '$lib/shared/utils/arktype.js';

const passwordMaxLength = 20;
const passwordMinLength = 8;
const allowedChars = /^[A-Za-z0-9!@$#()]+$/;

export const PasswordType = type.string
  .atLeastLength(passwordMinLength)
  .atMostLength(passwordMaxLength)
  .narrow((data, ctx) => {
    if (!allowedChars.test(data)) {
      return ctx.reject({
        problem: 'must only contain A–Z, a–z, 0–9, !@$#().'
      });
    }
    if (!/[A-Z]/.test(data)) {
      return ctx.reject({
        problem: 'must contain at least one uppercase letter.'
      });
    }
    if (!/[a-z]/.test(data)) {
      return ctx.reject({
        problem: 'must contain at least one lowercase letter.'
      });
    }
    if (!/[0-9]/.test(data)) {
      return ctx.reject({
        problem: 'must contain at least one number.'
      });
    }
    if (!/[!@$#()]/.test(data)) {
      return ctx.reject({
        problem: 'must contain at least one special character (!@$#()).'
      });
    }
    return true;
  });
