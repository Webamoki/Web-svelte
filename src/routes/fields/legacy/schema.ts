import { Day } from '$lib/shared/utils/zod.js';
import { z as zv4 } from 'zod/v4';

/** Legacy schema for fields not yet migrated to the new form system */
export const LegacySchema = zv4.object({
  color: zv4.string().min(4).max(7),
  selects: zv4.array(zv4.number()),
  tag: zv4.string(),
  tags: zv4.array(zv4.string()).min(1),
  textNull: zv4.email().nullable().default(null),
  weekday: Day,
  weekdays: zv4.array(Day).min(1)
});
