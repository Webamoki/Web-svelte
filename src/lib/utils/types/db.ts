import { CalendarDate, parseDate, parseTime, type Time } from '@internationalized/date';
import { customType, varchar } from 'drizzle-orm/pg-core';

import { HEX_COLOR_MAX, NAME_MAX } from './consts.js';

// General

const STRING_ENUM_MAX = 50;

export function stringEnum<T extends string>() {
	return varchar({ length: STRING_ENUM_MAX }).$type<T>();
}
export const name = () => varchar({ length: NAME_MAX });

export const hexColor = () => varchar({ length: HEX_COLOR_MAX });

// Date Time

// TODO: Absolute date time
export const time = customType<{ data: Time; driverData: string }>({
	dataType() {
		return 'time(0)';
	},
	fromDriver(value: string): Time {
		return parseTime(value);
	},
	toDriver(time: Time): string {
		return time.toString();
	}
});

export const date = customType<{ data: CalendarDate; driverData: string }>({
	dataType() {
		return 'date';
	},
	fromDriver(value: string): CalendarDate {
		return parseDate(value);
	},
	toDriver(date: CalendarDate): string {
		return date.toString();
	}
});
