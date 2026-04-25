import { CalendarDate, Day, Time } from '$lib/shared/utils/zod.js';
import { z } from 'zod/v4';

import { PasswordType } from './types/password.js';

export const MasterSchema = z.object({
  agreed: z.boolean(),
  calendarDate: CalendarDate,
  color: z.string().min(4).max(7),
  email: z.email(),
  emailNull: z.email().nullable().default(null),
  message: z.string(),
  password: PasswordType,
  pin: z.string().length(6),
  select: z.number(),
  selects: z.array(z.number()),
  tag: z.string(),
  tags: z.array(z.string()).min(1),
  time: Time,
  weekday: Day,
  weekdays: z.array(Day).min(1)
});

export const TextNullSchema = z.object({
  emailNull: z.email().nullable().default(null)
});

export const VirtualFormSchema = z.object({
  email: z.email(),
  message: z.string().min(10)
});
export const FormSchema = z.object({
  email: z.email(),
  message: z.string().min(10)
});
