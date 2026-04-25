import { CalendarDate, Day, Time } from '$lib/shared/utils/arktype.js';
import { type } from '$lib/shared/utils/arktype.js';

import { PasswordType } from './types/password.js';

export const MasterSchema = type({
  agreed: type.boolean,
  calendarDate: CalendarDate,
  color: type.string.atLeastLength(4).atMostLength(7),
  email: type.keywords.string.email,
  emailNull: type.keywords.string.email.or(type.null).default(null),
  message: type.string,
  password: PasswordType,
  pin: type.string.exactlyLength(6),
  select: type.number,
  selects: type.number.array(),
  tag: type.string,
  tags: type.string.array().moreThanLength(0),
  time: Time,
  weekday: Day,
  weekdays: Day.array().moreThanLength(0)
});

export const TextNullSchema = type({
  emailNull: type.keywords.string.email.or(type.null).default(null)
});

export const VirtualFormSchema = type({
  email: type.keywords.string.email,
  message: type.string.atLeastLength(10)
});
export const FormSchema = type({
  email: type.keywords.string.email,
  message: type.string.atLeastLength(10)
});
