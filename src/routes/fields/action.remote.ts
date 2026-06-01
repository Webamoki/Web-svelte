import { form } from '$app/server';
import { FormResult } from '$lib/shared/utils/form/result.js';

import {
  CheckboxSchema,
  ColorNullableSchema,
  ColorSchema,
  DateRangeSchema,
  DateSchema,
  EmailNullableSchema,
  EmailSchema,
  FileSchema,
  HiddenSchema,
  MessageSchema,
  NumberNullableSchema,
  NumberSchema,
  PasswordSchema,
  PinNullableSchema,
  PinSchema,
  SelectNullableSchema,
  SelectSchema,
  ShowcaseSchema,
  SliderSchema,
  TextNullableSchema,
  TextSchema,
  TimeSchema
} from './schemas.js';

const ok = <T>(data: T) => FormResult.okData({ data, message: 'Success!' });
const fail = <T>(data: T, message: string) => FormResult.errData({ data, message });

export const textForm = form(TextSchema, async (data) =>
  data.text === 'show success' ? ok(data) : fail(data, 'Type "show success" to succeed')
);

export const emailForm = form(EmailSchema, async (data) =>
  data.email === 'success@example.com' ? ok(data) : fail(data, 'Use success@example.com to succeed')
);

export const passwordForm = form(PasswordSchema, async (data) =>
  data.password === 'password123' ? ok(data) : fail(data, 'Password must be "password123"')
);

export const numberForm = form(NumberSchema, async (data) =>
  data.age >= 18 ? ok(data) : fail(data, 'Age must be 18 or older')
);

export const checkboxForm = form(CheckboxSchema, async (data) =>
  data.agreed ? ok(data) : fail(data, 'You must check the box')
);

export const colorForm = form(ColorSchema, async (data) =>
  data.color.toLowerCase() === '00ff00' ? ok(data) : fail(data, 'Pick pure green (#00ff00)')
);

export const messageForm = form(MessageSchema, async (data) =>
  data.message.toLowerCase().includes('success')
    ? ok(data)
    : fail(data, 'Message must contain the word "success"')
);

export const pinForm = form(PinSchema, async (data) =>
  data.pin === '123456' ? ok(data) : fail(data, 'Enter PIN 123456')
);

export const selectForm = form(SelectSchema, async (data) =>
  data.select === 'cherry' ? ok(data) : fail(data, 'Select "cherry"')
);

export const dateForm = form(DateSchema, async (data) => {
  const { date } = data;
  return date.year >= 2026 ? ok({ date }) : fail({ date }, 'Pick a date in 2026 or later');
});

export const timeForm = form(TimeSchema, async (data) => {
  const { time } = data;
  return time.hour >= 12 ? ok({ time }) : fail({ time }, 'Pick an afternoon time (12:00 or later)');
});

export const dateRangeForm = form(DateRangeSchema, async (data) => {
  const { endDate, startDate } = data;
  return ok({ endDate, startDate });
});

export const fileForm = form(FileSchema, async (data) =>
  ok({ name: data.file.name, size: data.file.size })
);

export const sliderForm = form(SliderSchema, async (data) =>
  data.level >= 50 ? ok(data) : fail(data, 'Set the level to 50 or higher')
);

export const hiddenForm = form(HiddenSchema, async (data) => ok(data));

export const showcaseForm = form(ShowcaseSchema, async (data) => ok(data));

export const textNullableForm = form(TextNullableSchema, async (data) => ok(data));
export const emailNullableForm = form(EmailNullableSchema, async (data) => ok(data));
export const numberNullableForm = form(NumberNullableSchema, async (data) => ok(data));
export const colorNullableForm = form(ColorNullableSchema, async (data) => ok(data));
export const pinNullableForm = form(PinNullableSchema, async (data) => ok(data));
export const selectNullableForm = form(SelectNullableSchema, async (data) => ok(data));
