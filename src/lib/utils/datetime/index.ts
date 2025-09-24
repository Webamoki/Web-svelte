import {
	CalendarDate,
	DateFormatter,
	getDayOfWeek,
	getLocalTimeZone,
	startOfMonth,
	Time,
	toCalendarDate,
	today,
	toTime,
	ZonedDateTime,
	type DateDuration
} from '@internationalized/date';
import { type } from 'arktype';
import { map, range } from 'ramda';

const DEFAULT_TIME_ZONE = 'Europe/London';
const DEFAULT_LOCALE = 'en-GB';

// Day of the week

export const Days = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday'
] as const;
export type Day = (typeof Days)[number];
export const Day = type.enumerated(...Days);

const DayIndex: Record<Day, number> = Object.fromEntries(
	Days.map((day, index) => [day, index])
) as Record<Day, number>;

/** Gets the day index of the date */
function getDayIndex(date: CalendarDate): number {
	// Always start 0 on Monday
	return getDayOfWeek(date, DEFAULT_LOCALE, 'mon');
}

/**
 * Gets the day of the week for a given date.
 * @param date - The date to get the day of the week for.
 * @returns The day of the week
 */
export function getDayOfDate(date: CalendarDate): Day {
	return Days[getDayIndex(date)];
}

/**
 * Checks if a given date is a specific day of the week.
 * @param date - The date to check.
 * @param dayOfWeek - The day of the week to check against.
 * @returns True if the date is the specified day, false otherwise.
 */
export function isDateDay(date: CalendarDate, dayOfWeek: Day): boolean {
	const dateDay = getDayOfDate(date);
	return dateDay === dayOfWeek;
}

/**
 * Checks if a given date is today.
 * @param date - The date to check.
 * @returns True if the date is today, false otherwise.
 */
export function isDateToday(date: CalendarDate, timezone: string): boolean {
	return today(timezone).compare(date) === 0;
}

/**
 * Calculates the age from a date of birth.
 * @param dob - The date of birth.
 * @returns The age in years.
 * @throws Error if the date of birth is in the future.
 */
export function ageFromDob(dob: CalendarDate, timezone: string): number {
	const todayDate = today(timezone);

	if (todayDate.compare(dob) < 0) {
		throw new Error('Date of birth is in the future');
	}

	let years = todayDate.year - dob.year;
	const monthDiff = todayDate.month - dob.month;
	const dayDiff = todayDate.day - dob.day;

	// Adjust years down if birthday hasn't occurred this year
	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
		years--;
	}

	return years;
}

/**
 * Gets the date of the next occurrence of a day of the week.
 * @param dayOfWeek - The day of the week to get the next occurrence for.
 * @param startDate - The date to check from. Inclusive.
 * @returns The date of the next occurrence of the specified day.
 */
export function getNextDateOfDay(dayOfWeek: Day, startDate: CalendarDate): CalendarDate {
	const dayIndex = DayIndex[dayOfWeek];
	const startIndex = getDayIndex(startDate);

	// Already on the day
	if (startIndex === dayIndex) return startDate;

	// Calculate how many days to add to get to the next occurrence
	const addition = (dayIndex - startIndex + 7) % 7;
	return startDate.add({ days: addition });
}

/**
 * Gets the most recent occurrence of a day of the week.
 * @param dayOfWeek - The day of the week
 * @param startDate - The date to check from. Inclusive.
 * @returns The most recent date for the specified day.
 * @throws An error if the day of the week is invalid.
 */
export function getLastDateOfDay(dayOfWeek: Day, startDate: CalendarDate): CalendarDate {
	const dayIndex = DayIndex[dayOfWeek];
	const startIndex = getDayIndex(startDate);

	// Already on the day
	if (startIndex === dayIndex) return startDate;

	// Calculate how many days to subtract to get to the previous occurrence
	const subtraction = (startIndex + 7 - dayIndex) % 7;
	return startDate.subtract({ days: subtraction });
}

/**
 * Gets an array of the last dates of the day of the week.
 * @param dayOfWeek - The day of the week.
 * @param count - The number of dates to get.
 * @param startDate - The date to check from. Inclusive.
 * @returns The array of dates from oldest to most recent.
 * @throws An error if the day of the week is invalid.
 */
export function getLastDatesOfDay(
	dayOfWeek: Day,
	count: number,
	startDate: CalendarDate
): CalendarDate[] {
	// Set up the array of dates
	if (count < 1) return [];

	// Get the most recent date
	const latestDate = getLastDateOfDay(dayOfWeek, startDate);
	// Calculate all dates subtracted, oldest -> most recent
	return map((i) => latestDate.subtract({ weeks: count - 1 - i }), range(0, count));
}

/**
 * Gets an array of dates of the last few months (first day) from a date.
 * @param count - The number of months to get.
 * @param startDate - The date to start from (defaults to today).
 * @returns The array of dates from oldest to most recent.
 */
export function getLastMonths(count: number, startDate: CalendarDate): CalendarDate[] {
	if (count < 1) return [];

	// Get the most recent date
	const latestDate = startOfMonth(startDate);

	// Calculate the previous dates
	return map((i) => latestDate.subtract({ months: count - 1 - i }), range(0, count));
}

/* Intervals */

/**
 * Checks if two time ranges overlap, boundaries are not considered overlapping.
 * @param start1 - The start time of the first range.
 * @param end1 - The end time of the first range.
 * @param start2 - The start time of the second range.
 * @param end2 - The end time of the second range.
 * @returns True if the ranges overlap, false otherwise.
 */
export function checkOverlap(start1: Time, end1: Time, start2: Time, end2: Time): boolean {
	return start1.compare(end2) < 0 && start2.compare(end1) < 0;
}

/**
 * Determines if the given dates are within the given duration of each other.
 * @param date1 - The first date in order.
 * @param date2 - The second date in order.
 * @param duration - The duration to check against. Inclusive of boundaries.
 * @returns True if the dates are within duration, false otherwise.
 */
export function datesWithin(
	date1: CalendarDate,
	date2: CalendarDate,
	duration: DateDuration
): boolean {
	// reject invalid order
	if (date1.compare(date2) > 0) return false;

	return date1.add(duration).compare(date2) >= 0;
}

const msPerWeek = 7 * 24 * 60 * 60 * 1000;

/**
 * Calculates the difference in weeks between two dates.
 * @param date1 - The first date in order.
 * @param date2 - The second date in order.
 */
export function dateDiffWeeks(date1: CalendarDate, date2: CalendarDate): number {
	const date1Abs = date1.toDate(DEFAULT_TIME_ZONE).getTime();
	const date2Abs = date2.toDate(DEFAULT_TIME_ZONE).getTime();

	return Math.floor((date2Abs - date1Abs) / msPerWeek);
}

/* Formatting */

/* Day of the week*/

/**
 * Formats a day of the week.
 * @param day - The day of the week to format.
 * @example "Monday" -> "Mon"
 * @returns Formatted string of the day of the week.
 */
export function formatDayShort(day: Day): string {
	// Use the first three letters of the day
	return day.slice(0, 3);
}

/**
 * Formats a day of the week.
 * @param day - The day of the week to format.
 * @example "Monday" -> "M"
 * @returns Formatted letter of the day of the week.
 */
export function formatDayLetter(day: Day): string {
	// Use the first letters of the day
	return day.slice(0, 1);
}

/* Calendar Dates */

const FullDateFormatter = new DateFormatter(DEFAULT_LOCALE, {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
});

const ShortDateFormatter = new DateFormatter(DEFAULT_LOCALE, {
	month: 'short',
	day: 'numeric'
});

const MonthFormatter = new DateFormatter(DEFAULT_LOCALE, {
	month: 'short',
	year: '2-digit'
});

const NumFormatter = new DateFormatter(DEFAULT_LOCALE, {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric'
});

function formatDate(date: CalendarDate, formatter: DateFormatter): string {
	const nativeDate = date.toDate(getLocalTimeZone());
	return formatter.format(nativeDate);
}

/**
 * @param date The CalendarDate object to format.
 * @returns string of date in shortened format
 * @example "Oct 5"
 */
export function formatDateShort(date: CalendarDate) {
	return formatDate(date, ShortDateFormatter);
}

/**
 * @param date The CalendarDate object to format.
 * @returns The formatted date string.
 * @example "5 Oct 2023"
 */
export function formatDateFull(date: CalendarDate) {
	return formatDate(date, FullDateFormatter);
}

/**
 * ISO format
 * @param date The CalendarDate object to format.
 * @returns The formatted date string in YYYY-MM-DD format.
 * @example "2023-10-05"
 */
export function formatDateISO(date: CalendarDate): string {
	return date.toString();
}

/**
 * @param date The CalendarDate object to format.
 * @returns The formatted date string in dd/mm/yyyy format.
 * @example "05/10/2023"
 */
export function formatDateNum(date: CalendarDate): string {
	return formatDate(date, NumFormatter);
}

/**
 * Formats the month only.
 * @param date - The date to format.
 * @returns The formatted month string.
 * @example "Oct"
 */
export function formatMonth(date: CalendarDate): string {
	return formatDate(date, MonthFormatter);
}

/* Times */

// Pad number with zeroes to the left
function padNum(num: number, len: number): string {
	if (isNaN(num)) {
		return '0'.repeat(len);
	}

	return num.toString().padStart(len, '0');
}

/**
 * Gives time in HH:MM format
 * @param time
 * @returns string of time in that format
 */
export function formatTimeShort(time: Time): string {
	const hours = padNum(time.hour, 2);
	const minutes = padNum(time.minute, 2);
	return `${hours}:${minutes}`;
}

/**
 * Gives time in HH:MM:SS format
 * @param time
 * @returns string of time in that format
 */
export function formatTimeFull(time: Time): string {
	const hours = padNum(time.hour, 2);
	const minutes = padNum(time.minute, 2);
	const seconds = padNum(time.second, 2);
	return `${hours}:${minutes}:${seconds}`;
}

/**
 * Calculates the end time given a starting time and duration.
 * @param timeStart starting time
 * @param durationMinutes duration in minutes
 * @returns end time in HH:MM format
 */
export function formatTimeEnd(timeStart: Time, durationMinutes: number): string {
	const timeEnd = timeStart.add({ minutes: durationMinutes });
	return formatTimeShort(timeEnd);
}

/**
 * Formats a full date and time.
 * @param datetime The ZonedDateTime object to format.
 * @returns The formatted date and time string.
 * @example "05/10/2023 14:30:00"
 */
export function formatAbsolute(datetime: ZonedDateTime): string {
	const date = toCalendarDate(datetime);
	const time = toTime(datetime);
	return `${formatDateNum(date)} ${formatTimeFull(time)}`;
}

/* State handling */

/**
 * Unfreezes a CalendarDate object from a snapshot.
 * @param raw - The snapshot of the CalendarDate object.
 * @returns The unfrozen CalendarDate object.
 */
export function unfreezeDate(raw: $state.Snapshot<CalendarDate>): CalendarDate {
	return new CalendarDate(raw.year, raw.month, raw.day);
}

/**
 * Unfreezes a Time object from a snapshot.
 * @param raw - The snapshot of the Time object.
 * @returns The unfrozen Time object.
 */
export function unfreezeTime(raw: $state.Snapshot<Time>): Time {
	return new Time(raw.hour, raw.minute, raw.second, raw.millisecond);
}
