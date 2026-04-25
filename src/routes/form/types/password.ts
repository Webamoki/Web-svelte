import { z } from 'zod/v4';

const passwordMaxLength = 20;
const passwordMinLength = 8;

export const PasswordType = z
  .string()
  .min(passwordMinLength)
  .max(passwordMaxLength)
  .regex(/^[A-Za-z0-9!@$#()]+$/, 'must only contain A–Z, a–z, 0–9, !@$#().')
  .regex(/[A-Z]/, 'must contain at least one uppercase letter.')
  .regex(/[a-z]/, 'must contain at least one lowercase letter.')
  .regex(/[0-9]/, 'must contain at least one number.')
  .regex(/[!@$#()]/, 'must contain at least one special character (!@$#()).');
