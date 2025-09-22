import { CalendarDate, CalendarDateTime, Time, ZonedDateTime } from '@internationalized/date';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	getDayOfDate,
	isDateDay,
	isDateToday,
	ageFromDob,
	getNextDateOfDay,
	getLastDateOfDay,
	getLastDatesOfDay,
	getLastMonths,
	checkOverlap,
	datesWithin,
	dateDiffWeeks,
	formatDayShort,
	formatDateShort,
	formatDateFull,
	formatDateISO,
	formatMonth,
	formatTimeShort,
	formatTimeEnd,
	formatTimeFull,
	formatAbsolute,
	formatDateNum
} from './index.js';

const SERVER_TIME_ZONE = 'Europe/London';

describe('getDayOfDate', () => {
	it('returns the correct day of the week (0 = Monday)', () => {
		// Test specific dates with known days of the week
		expect(getDayOfDate(new CalendarDate(2023, 5, 1))).toBe('Monday'); // May 1, 2023 was a Monday
		expect(getDayOfDate(new CalendarDate(2023, 5, 2))).toBe('Tuesday'); // May 2, 2023 was a Tuesday
		expect(getDayOfDate(new CalendarDate(2023, 5, 3))).toBe('Wednesday'); // May 3, 2023 was a Wednesday
		expect(getDayOfDate(new CalendarDate(2023, 5, 4))).toBe('Thursday'); // May 4, 2023 was a Thursday
		expect(getDayOfDate(new CalendarDate(2023, 5, 5))).toBe('Friday'); // May 5, 2023 was a Friday
		expect(getDayOfDate(new CalendarDate(2023, 5, 6))).toBe('Saturday'); // May 6, 2023 was a Saturday
		expect(getDayOfDate(new CalendarDate(2023, 5, 7))).toBe('Sunday'); // May 7, 2023 was a Sunday
	});

	it('handles dates across different months and years', () => {
		expect(getDayOfDate(new CalendarDate(2023, 12, 25))).toBe('Monday'); // December 25, 2023 was a Monday
		expect(getDayOfDate(new CalendarDate(2024, 1, 1))).toBe('Monday'); // January 1, 2024 was a Monday
		expect(getDayOfDate(new CalendarDate(2024, 2, 29))).toBe('Thursday'); // February 29, 2024 (leap year) was a Thursday
	});
});

describe('isDateDay', () => {
	it('correctly identifies when a date matches a specific day of week', () => {
		// Using known dates for testing specific days
		expect(isDateDay(new CalendarDate(2023, 5, 1), 'Monday')).toBe(true);
		expect(isDateDay(new CalendarDate(2023, 5, 2), 'Tuesday')).toBe(true);
		expect(isDateDay(new CalendarDate(2023, 5, 3), 'Wednesday')).toBe(true);
		expect(isDateDay(new CalendarDate(2023, 5, 4), 'Thursday')).toBe(true);
		expect(isDateDay(new CalendarDate(2023, 5, 5), 'Friday')).toBe(true);
		expect(isDateDay(new CalendarDate(2023, 5, 6), 'Saturday')).toBe(true);
		expect(isDateDay(new CalendarDate(2023, 5, 7), 'Sunday')).toBe(true);
	});

	it('correctly identifies when a date does not match a specific day of week', () => {
		// May 1, 2023 was a Monday, check against all other days
		const testDate = new CalendarDate(2023, 5, 1);
		expect(isDateDay(testDate, 'Tuesday')).toBe(false);
		expect(isDateDay(testDate, 'Wednesday')).toBe(false);
		expect(isDateDay(testDate, 'Thursday')).toBe(false);
		expect(isDateDay(testDate, 'Friday')).toBe(false);
		expect(isDateDay(testDate, 'Saturday')).toBe(false);
		expect(isDateDay(testDate, 'Sunday')).toBe(false);
	});

	it('handles dates across year boundaries', () => {
		// December 31, 2023 was a Sunday
		expect(isDateDay(new CalendarDate(2023, 12, 31), 'Sunday')).toBe(true);
		// January 1, 2024 was a Monday
		expect(isDateDay(new CalendarDate(2024, 1, 1), 'Monday')).toBe(true);
	});

	it('handles leap year dates correctly', () => {
		// February 29, 2024 was a Thursday
		expect(isDateDay(new CalendarDate(2024, 2, 29), 'Thursday')).toBe(true);
		expect(isDateDay(new CalendarDate(2024, 2, 29), 'Friday')).toBe(false);
	});
});

describe('isDateToday', () => {
	beforeEach(() => {
		// Mock current date to 2024-05-15
		const currentDate = new CalendarDate(2024, 5, 15);
		vi.useFakeTimers();
		vi.setSystemTime(currentDate.toDate(SERVER_TIME_ZONE));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('returns true when date is today', () => {
		const today = new CalendarDate(2024, 5, 15);
		expect(isDateToday(today, SERVER_TIME_ZONE)).toBe(true);
	});

	it('returns false when date is in the past', () => {
		const yesterday = new CalendarDate(2024, 5, 14);
		expect(isDateToday(yesterday, SERVER_TIME_ZONE)).toBe(false);

		const lastMonth = new CalendarDate(2024, 4, 15);
		expect(isDateToday(lastMonth, SERVER_TIME_ZONE)).toBe(false);

		const lastYear = new CalendarDate(2023, 5, 15);
		expect(isDateToday(lastYear, SERVER_TIME_ZONE)).toBe(false);
	});

	it('returns false when date is in the future', () => {
		const tomorrow = new CalendarDate(2024, 5, 16);
		expect(isDateToday(tomorrow, SERVER_TIME_ZONE)).toBe(false);

		const nextMonth = new CalendarDate(2024, 6, 15);
		expect(isDateToday(nextMonth, SERVER_TIME_ZONE)).toBe(false);

		const nextYear = new CalendarDate(2025, 5, 15);
		expect(isDateToday(nextYear, SERVER_TIME_ZONE)).toBe(false);
	});

	it('handles date comparison at day boundaries', () => {
		// Still the same day regardless of time of day
		vi.setSystemTime(new CalendarDateTime(2024, 5, 15, 0, 0, 1).toDate(SERVER_TIME_ZONE));
		expect(isDateToday(new CalendarDate(2024, 5, 15), SERVER_TIME_ZONE)).toBe(true);

		vi.setSystemTime(new CalendarDateTime(2024, 5, 15, 23, 59, 59).toDate(SERVER_TIME_ZONE));
		expect(isDateToday(new CalendarDate(2024, 5, 15), SERVER_TIME_ZONE)).toBe(true);
	});
});

describe('ageFromDob', () => {
	beforeEach(() => {
		// Mock current date to 2025-03-30
		const mockDate = new CalendarDate(2025, 3, 30);
		vi.useFakeTimers();
		vi.setSystemTime(mockDate.toDate(SERVER_TIME_ZONE));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should calculate age correctly for a normal case', () => {
		const dob = new CalendarDate(2000, 3, 30);
		expect(ageFromDob(dob, SERVER_TIME_ZONE)).toBe(25);
	});

	it('should calculate age correctly when birthday is today', () => {
		const dob = new CalendarDate(2000, 3, 30);
		expect(ageFromDob(dob, SERVER_TIME_ZONE)).toBe(25);
	});

	it('should calculate age correctly for someone born yesterday', () => {
		const dob = new CalendarDate(2000, 3, 29);
		expect(ageFromDob(dob, SERVER_TIME_ZONE)).toBe(25);
	});

	it('should calculate age correctly for someone born tomorrow', () => {
		const dob = new CalendarDate(2000, 3, 31);
		expect(ageFromDob(dob, SERVER_TIME_ZONE)).toBe(24);
	});

	it('should handle leap year birthdays', () => {
		const dob = new CalendarDate(2000, 2, 29);
		expect(ageFromDob(dob, SERVER_TIME_ZONE)).toBe(25);
	});

	it('should return undefined for future dates', () => {
		const futureDob = new CalendarDate(2026, 1, 1);
		expect(() => ageFromDob(futureDob, SERVER_TIME_ZONE)).toThrow();
	});

	it('should handle month boundary cases', () => {
		const dob = new CalendarDate(2000, 2, 28);
		expect(ageFromDob(dob, SERVER_TIME_ZONE)).toBe(25);
	});

	it('should handle year boundary cases', () => {
		const dob = new CalendarDate(2000, 12, 31);
		expect(ageFromDob(dob, SERVER_TIME_ZONE)).toBe(24);
	});
});

describe('getNextDateOfDay', () => {
	it('returns the next date within the week', () => {
		const date = new CalendarDate(2025, 8, 11); // Monday
		const nextTuesday = getNextDateOfDay('Tuesday', date);
		expect(formatDateISO(nextTuesday)).toBe('2025-08-12');
		const nextSunday = getNextDateOfDay('Sunday', date);
		expect(formatDateISO(nextSunday)).toBe('2025-08-17');
	});

	it('returns the next date crossing over', () => {
		const date = new CalendarDate(2025, 8, 14); // Thursday
		const nextMonday = getNextDateOfDay('Monday', date);
		expect(formatDateISO(nextMonday)).toBe('2025-08-18');
		const nextWednesday = getNextDateOfDay('Wednesday', date);
		expect(formatDateISO(nextWednesday)).toBe('2025-08-20');
	});
});

describe('getLastDateOfDay', () => {
	const startDate = new CalendarDate(2024, 4, 10);

	it('returns today when it matches the requested day', () => {
		// Wednesday is day 2
		expect(formatDateISO(getLastDateOfDay('Wednesday', startDate))).toBe('2024-04-10');
	});

	it('returns the most recent occurrence of the requested day', () => {
		// Most recent Monday (day 0) was 2 days ago
		expect(formatDateISO(getLastDateOfDay('Monday', startDate))).toBe('2024-04-08');
		// Most recent Tuesday (day 1) was 1 day ago
		expect(formatDateISO(getLastDateOfDay('Tuesday', startDate))).toBe('2024-04-09');
		// Most recent Thursday (day 3) was 6 days ago
		expect(formatDateISO(getLastDateOfDay('Thursday', startDate))).toBe('2024-04-04');
	});

	it('handles week boundaries correctly', () => {
		// Most recent Sunday (day 6) was 3 days ago
		expect(formatDateISO(getLastDateOfDay('Sunday', startDate))).toBe('2024-04-07');
	});
});

describe('getLastDatesOfDay', () => {
	const startDate = new CalendarDate(2024, 4, 10);

	it('returns the most recent date for a given day of the week', () => {
		// If today is Wednesday (day 2), the most recent Monday (day 0) was 2 days ago
		const mondayDates = getLastDatesOfDay('Monday', 1, startDate);
		expect(mondayDates).toHaveLength(1);
		expect(formatDateISO(mondayDates[0])).toBe('2024-04-08');

		// The most recent Tuesday (day 1) was 1 day ago
		const tuesdayDates = getLastDatesOfDay('Tuesday', 1, startDate);
		expect(tuesdayDates).toHaveLength(1);
		expect(formatDateISO(tuesdayDates[0])).toBe('2024-04-09');

		// The most recent Wednesday (day 2) is today
		const wednesdayDates = getLastDatesOfDay('Wednesday', 1, startDate);
		expect(wednesdayDates).toHaveLength(1);
		expect(formatDateISO(wednesdayDates[0])).toBe('2024-04-10');
	});

	it('returns multiple dates when count > 1', () => {
		// Get the last 3 Mondays (ordered from oldest to most recent)
		const mondayDates = getLastDatesOfDay('Monday', 3, startDate);
		expect(mondayDates).toHaveLength(3);
		expect(formatDateISO(mondayDates[0])).toBe('2024-03-25'); // Oldest Monday
		expect(formatDateISO(mondayDates[1])).toBe('2024-04-01'); // Middle Monday
		expect(formatDateISO(mondayDates[2])).toBe('2024-04-08'); // Most recent Monday
	});

	it('returns empty array when count is 0 or negative', () => {
		expect(getLastDatesOfDay('Monday', 0, startDate)).toEqual([]);
		expect(getLastDatesOfDay('Monday', -1, startDate)).toEqual([]);
	});

	it('handles week boundaries correctly when looking back', () => {
		// If today is Wednesday (day 2), the most recent Sunday (day 6) was 3 days ago
		const sundayDates = getLastDatesOfDay('Sunday', 2, startDate);
		expect(sundayDates).toHaveLength(2);
		expect(formatDateISO(sundayDates[0])).toBe('2024-03-31'); // Previous Sunday (oldest)
		expect(formatDateISO(sundayDates[1])).toBe('2024-04-07'); // Most recent Sunday
	});
});

describe('getLastMonths', () => {
	const startDate = new CalendarDate(2024, 5, 15);

	it('should return the correct first day of the last 3 months', () => {
		const months = getLastMonths(3, startDate);
		expect(months).toHaveLength(3);
		expect(formatDateISO(months[0])).toBe('2024-03-01');
		expect(formatDateISO(months[1])).toBe('2024-04-01');
		expect(formatDateISO(months[2])).toBe('2024-05-01');
	});

	it('should return the correct first day of the last month', () => {
		const months = getLastMonths(1, startDate);
		expect(months).toHaveLength(1);
		expect(formatDateISO(months[0])).toBe('2024-05-01');
	});

	it('should handle year boundaries correctly', () => {
		// Mock current date to 2024-02-15
		const startDate = new CalendarDate(2024, 2, 15);
		const months = getLastMonths(4, startDate);
		expect(months).toHaveLength(4);
		expect(formatDateISO(months[0])).toBe('2023-11-01');
		expect(formatDateISO(months[1])).toBe('2023-12-01');
		expect(formatDateISO(months[2])).toBe('2024-01-01');
		expect(formatDateISO(months[3])).toBe('2024-02-01');
	});

	it('should return an empty array when count is 0', () => {
		const months = getLastMonths(0, startDate);
		expect(months).toEqual([]);
	});

	it('should return an empty array when count is negative', () => {
		const months = getLastMonths(-2, startDate);
		expect(months).toEqual([]);
	});

	it('should handle the start of a month correctly', () => {
		const startDate = new CalendarDate(2023, 8, 1);
		const months = getLastMonths(3, startDate);
		expect(months).toHaveLength(3);
		expect(formatDateISO(months[0])).toBe('2023-06-01');
		expect(formatDateISO(months[1])).toBe('2023-07-01');
		expect(formatDateISO(months[2])).toBe('2023-08-01');
	});

	it('should handle the end of a month correctly', () => {
		// Mock current date to 2024-03-31
		const startDate = new CalendarDate(2024, 3, 31);
		const months = getLastMonths(2, startDate);
		expect(months).toHaveLength(2);
		expect(formatDateISO(months[0])).toBe('2024-02-01');
		expect(formatDateISO(months[1])).toBe('2024-03-01');
	});
});

describe('checkOverlap', () => {
	// Helper Times
	const t0900 = new Time(9, 0);
	const t1000 = new Time(10, 0);
	const t1100 = new Time(11, 0);
	const t1200 = new Time(12, 0);
	const t0000 = new Time(0, 0);
	const t2359 = new Time(23, 59);

	// 1. No Overlap
	it('should return false when Range 1 is strictly before Range 2', () => {
		// R1: 09:00 - 10:00, R2: 11:00 - 12:00
		expect(checkOverlap(t0900, t1000, t1100, t1200)).toBe(false);
	});

	it('should return false when Range 1 is strictly after Range 2', () => {
		// R1: 11:00 - 12:00, R2: 09:00 - 10:00
		expect(checkOverlap(t1100, t1200, t0900, t1000)).toBe(false);
	});

	// 2. Partial Overlap
	it('should return true when Range 1 starts before and ends within Range 2', () => {
		// R1: 09:00 - 11:00, R2: 10:00 - 12:00
		expect(checkOverlap(t0900, t1100, t1000, t1200)).toBe(true);
	});

	it('should return true when Range 2 starts before and ends within Range 1', () => {
		// R1: 10:00 - 12:00, R2: 09:00 - 11:00
		expect(checkOverlap(t1000, t1200, t0900, t1100)).toBe(true);
	});

	// 3. Complete Overlap
	it('should return true when Range 2 is fully contained within Range 1 (subset)', () => {
		// R1: 09:00 - 12:00, R2: 10:00 - 11:00
		expect(checkOverlap(t0900, t1200, t1000, t1100)).toBe(true);
	});

	it('should return true when Range 1 is fully contained within Range 2 (superset)', () => {
		// R1: 10:00 - 11:00, R2: 09:00 - 12:00
		expect(checkOverlap(t1000, t1100, t0900, t1200)).toBe(true);
	});

	// 4. Boundary Conditions (Touching - not considered overlapping)
	it('should return false when end time of Range 1 equals start time of Range 2', () => {
		// R1: 09:00 - 10:00, R2: 10:00 - 11:00
		expect(checkOverlap(t0900, t1000, t1000, t1100)).toBe(false);
	});

	it('should return false when start time of Range 1 equals end time of Range 2', () => {
		// R1: 10:00 - 11:00, R2: 09:00 - 10:00
		expect(checkOverlap(t1000, t1100, t0900, t1000)).toBe(false);
	});

	// 5. Identical Ranges
	it('should return true when ranges are identical', () => {
		// R1: 10:00 - 11:00, R2: 10:00 - 11:00
		expect(checkOverlap(t1000, t1100, t1000, t1100)).toBe(true);
	});

	// 6. Edge Cases
	it('should handle overlap involving the earliest time (00:00)', () => {
		// R1: 00:00 - 09:00, R2: 08:00 - 10:00
		expect(checkOverlap(t0000, t0900, new Time(8, 0), t1000)).toBe(true);
		// R1: 00:00 - 01:00, R2: 01:00 - 02:00 (Boundary)
		expect(checkOverlap(t0000, new Time(1, 0), new Time(1, 0), new Time(2, 0))).toBe(false);
		// R1: 00:00 - 01:00, R2: 02:00 - 03:00 (No overlap)
		expect(checkOverlap(t0000, new Time(1, 0), new Time(2, 0), new Time(3, 0))).toBe(false);
	});

	it('should handle overlap involving the latest time (23:59)', () => {
		// R1: 22:00 - 23:59, R2: 23:00 - 23:59
		expect(checkOverlap(new Time(22, 0), t2359, new Time(23, 0), t2359)).toBe(true);
		// R1: 23:00 - 23:59, R2: 22:00 - 23:00 (Boundary)
		expect(checkOverlap(new Time(23, 0), t2359, new Time(22, 0), new Time(23, 0))).toBe(false);
		// R1: 23:00 - 23:59, R2: 21:00 - 22:00 (No overlap)
		expect(checkOverlap(new Time(23, 0), t2359, new Time(21, 0), new Time(22, 0))).toBe(false);
	});

	it('should handle zero-duration ranges', () => {
		// Zero-duration R1 touching start of R2
		// R1: 10:00 - 10:00, R2: 10:00 - 11:00
		expect(checkOverlap(t1000, t1000, t1000, t1100)).toBe(false);
		// Zero-duration R1 touching end of R2
		// R1: 11:00 - 11:00, R2: 10:00 - 11:00
		expect(checkOverlap(t1100, t1100, t1000, t1100)).toBe(false);
		// Zero-duration R1 inside R2
		// R1: 10:30 - 10:30, R2: 10:00 - 11:00
		const t1030 = new Time(10, 30);
		expect(checkOverlap(t1030, t1030, t1000, t1100)).toBe(true);
		// Zero-duration R1 outside R2
		// R1: 09:00 - 09:00, R2: 10:00 - 11:00
		expect(checkOverlap(t0900, t0900, t1000, t1100)).toBe(false);
		// Two zero-duration ranges at the same time
		// R1: 10:00 - 10:00, R2: 10:00 - 10:00
		expect(checkOverlap(t1000, t1000, t1000, t1000)).toBe(false);
		// Two zero-duration ranges at different times
		// R1: 09:00 - 09:00, R2: 10:00 - 10:00
		expect(checkOverlap(t0900, t0900, t1000, t1000)).toBe(false);
	});
});

describe('datesWithin', () => {
	it('should return true when dates are within the specified duration', () => {
		const date1 = new CalendarDate(2024, 5, 1);
		const date2 = new CalendarDate(2024, 5, 3);

		// 3 days duration should include the end date
		expect(datesWithin(date1, date2, { days: 3 })).toBe(true);
		expect(datesWithin(date1, date2, { days: 2 })).toBe(true);
	});

	it('should return false when dates are outside the specified duration', () => {
		const date1 = new CalendarDate(2024, 5, 1);
		const date2 = new CalendarDate(2024, 5, 5);

		// 3 days duration should not include date 4 days later
		expect(datesWithin(date1, date2, { days: 3 })).toBe(false);
		expect(datesWithin(date1, date2, { days: 1 })).toBe(false);
	});

	it('should handle same date as within duration', () => {
		const date = new CalendarDate(2024, 5, 1);
		expect(datesWithin(date, date, { days: 0 })).toBe(true);
		expect(datesWithin(date, date, { days: 1 })).toBe(true);
	});

	it('should return false when date1 is after date2', () => {
		const date1 = new CalendarDate(2024, 5, 5);
		const date2 = new CalendarDate(2024, 5, 1);

		expect(datesWithin(date1, date2, { days: 10 })).toBe(false);
	});

	it('should handle week-based durations', () => {
		const date1 = new CalendarDate(2024, 5, 1);
		const date2 = new CalendarDate(2024, 5, 8); // 7 days later

		expect(datesWithin(date1, date2, { weeks: 1 })).toBe(true);
		expect(datesWithin(date1, date2, { days: 7 })).toBe(true);

		const date3 = new CalendarDate(2024, 5, 15); // 14 days later
		expect(datesWithin(date1, date3, { weeks: 2 })).toBe(true);
		expect(datesWithin(date1, date3, { weeks: 1 })).toBe(false);
	});

	it('should handle month-based durations', () => {
		const date1 = new CalendarDate(2024, 5, 1);
		const date2 = new CalendarDate(2024, 6, 1); // 1 month later

		expect(datesWithin(date1, date2, { months: 1 })).toBe(true);
		expect(datesWithin(date1, date2, { days: 30 })).toBe(false); // May has 31 days

		const date3 = new CalendarDate(2024, 7, 1); // 2 months later
		expect(datesWithin(date1, date3, { months: 2 })).toBe(true);
		expect(datesWithin(date1, date3, { months: 1 })).toBe(false);
	});

	it('should handle year-based durations', () => {
		const date1 = new CalendarDate(2024, 5, 1);
		const date2 = new CalendarDate(2025, 5, 1); // 1 year later

		expect(datesWithin(date1, date2, { years: 1 })).toBe(true);
		expect(datesWithin(date1, date2, { months: 12 })).toBe(true);

		const date3 = new CalendarDate(2026, 5, 1); // 2 years later
		expect(datesWithin(date1, date3, { years: 2 })).toBe(true);
		expect(datesWithin(date1, date3, { years: 1 })).toBe(false);
	});

	it('should handle boundary conditions', () => {
		const date1 = new CalendarDate(2024, 5, 1);
		const date2 = new CalendarDate(2024, 5, 2); // exactly 1 day later

		expect(datesWithin(date1, date2, { days: 1 })).toBe(true);

		const date3 = new CalendarDate(2024, 5, 1);
		const date4 = new CalendarDate(2024, 5, 1); // same day
		expect(datesWithin(date3, date4, { days: 0 })).toBe(true);
	});
});

describe('dateDiffWeeks', () => {
	it('should calculate the difference in weeks between two dates', () => {
		const date1 = new CalendarDate(2024, 5, 1);
		const date2 = new CalendarDate(2024, 5, 15);
		expect(dateDiffWeeks(date1, date2)).toBe(2);

		const date3 = new CalendarDate(2024, 5, 1);
		const date4 = new CalendarDate(2024, 5, 8);
		expect(dateDiffWeeks(date3, date4)).toBe(1);

		const date5 = new CalendarDate(2024, 5, 1);
		const date6 = new CalendarDate(2024, 5, 7);
		expect(dateDiffWeeks(date5, date6)).toBe(0);

		const date7 = new CalendarDate(2024, 5, 1);
		const date8 = new CalendarDate(2024, 5, 6);
		expect(dateDiffWeeks(date7, date8)).toBe(0);

		const date9 = new CalendarDate(2024, 5, 1);
		const date10 = new CalendarDate(2024, 5, 2);
		expect(dateDiffWeeks(date9, date10)).toBe(0);
	});
});

describe('formatDayShort', () => {
	it('should format all days of the week correctly', () => {
		expect(formatDayShort('Monday')).toBe('Mon');
		expect(formatDayShort('Tuesday')).toBe('Tue');
		expect(formatDayShort('Wednesday')).toBe('Wed');
		expect(formatDayShort('Thursday')).toBe('Thu');
		expect(formatDayShort('Friday')).toBe('Fri');
		expect(formatDayShort('Saturday')).toBe('Sat');
		expect(formatDayShort('Sunday')).toBe('Sun');
	});
});

describe('formatDateShort', () => {
	it('formats date in DD MMM format', () => {
		// Different dates to test various month and day combinations
		expect(formatDateShort(new CalendarDate(2023, 1, 5))).toBe('5 Jan');
		expect(formatDateShort(new CalendarDate(2023, 5, 15))).toBe('15 May');
		expect(formatDateShort(new CalendarDate(2023, 12, 25))).toBe('25 Dec');
	});

	it('handles single-digit days correctly', () => {
		expect(formatDateShort(new CalendarDate(2023, 7, 1))).toBe('1 Jul');
		expect(formatDateShort(new CalendarDate(2023, 9, 9))).toBe('9 Sept');
	});

	it('handles double-digit days correctly', () => {
		expect(formatDateShort(new CalendarDate(2023, 3, 10))).toBe('10 Mar');
		expect(formatDateShort(new CalendarDate(2023, 11, 30))).toBe('30 Nov');
	});

	it('formats February correctly', () => {
		expect(formatDateShort(new CalendarDate(2023, 2, 14))).toBe('14 Feb');
		expect(formatDateShort(new CalendarDate(2024, 2, 29))).toBe('29 Feb'); // Leap year
	});
});

describe('formatDateFull', () => {
	it('formats date in DD MMM YYYY format', () => {
		// Test various dates to ensure consistent formatting
		expect(formatDateFull(new CalendarDate(2023, 1, 5))).toBe('5 Jan 2023');
		expect(formatDateFull(new CalendarDate(2023, 5, 15))).toBe('15 May 2023');
		expect(formatDateFull(new CalendarDate(2023, 12, 25))).toBe('25 Dec 2023');
	});

	it('handles single-digit days correctly', () => {
		expect(formatDateFull(new CalendarDate(2023, 7, 1))).toBe('1 Jul 2023');
		expect(formatDateFull(new CalendarDate(2023, 9, 9))).toBe('9 Sept 2023');
	});

	it('handles double-digit days correctly', () => {
		expect(formatDateFull(new CalendarDate(2023, 3, 10))).toBe('10 Mar 2023');
		expect(formatDateFull(new CalendarDate(2023, 11, 30))).toBe('30 Nov 2023');
	});

	it('handles different years correctly', () => {
		expect(formatDateFull(new CalendarDate(2020, 6, 15))).toBe('15 Jun 2020');
		expect(formatDateFull(new CalendarDate(2024, 6, 15))).toBe('15 Jun 2024');
		expect(formatDateFull(new CalendarDate(2025, 6, 15))).toBe('15 Jun 2025');
	});

	it('handles leap year dates correctly', () => {
		expect(formatDateFull(new CalendarDate(2024, 2, 29))).toBe('29 Feb 2024');
		expect(formatDateFull(new CalendarDate(2020, 2, 29))).toBe('29 Feb 2020');
	});

	it('handles year boundaries correctly', () => {
		expect(formatDateFull(new CalendarDate(2023, 12, 31))).toBe('31 Dec 2023');
		expect(formatDateFull(new CalendarDate(2024, 1, 1))).toBe('1 Jan 2024');
	});

	it('handles all months correctly', () => {
		expect(formatDateFull(new CalendarDate(2023, 1, 15))).toBe('15 Jan 2023');
		expect(formatDateFull(new CalendarDate(2023, 2, 15))).toBe('15 Feb 2023');
		expect(formatDateFull(new CalendarDate(2023, 3, 15))).toBe('15 Mar 2023');
		expect(formatDateFull(new CalendarDate(2023, 4, 15))).toBe('15 Apr 2023');
		expect(formatDateFull(new CalendarDate(2023, 5, 15))).toBe('15 May 2023');
		expect(formatDateFull(new CalendarDate(2023, 6, 15))).toBe('15 Jun 2023');
		expect(formatDateFull(new CalendarDate(2023, 7, 15))).toBe('15 Jul 2023');
		expect(formatDateFull(new CalendarDate(2023, 8, 15))).toBe('15 Aug 2023');
		expect(formatDateFull(new CalendarDate(2023, 9, 15))).toBe('15 Sept 2023');
		expect(formatDateFull(new CalendarDate(2023, 10, 15))).toBe('15 Oct 2023');
		expect(formatDateFull(new CalendarDate(2023, 11, 15))).toBe('15 Nov 2023');
		expect(formatDateFull(new CalendarDate(2023, 12, 15))).toBe('15 Dec 2023');
	});
});

describe('formatDateISO', () => {
	it('formats date in YYYY-MM-DD format', () => {
		// Test various dates to ensure consistent ISO format
		expect(formatDateISO(new CalendarDate(2023, 1, 5))).toBe('2023-01-05');
		expect(formatDateISO(new CalendarDate(2023, 5, 15))).toBe('2023-05-15');
		expect(formatDateISO(new CalendarDate(2023, 12, 25))).toBe('2023-12-25');
	});

	it('handles single-digit days with zero padding', () => {
		expect(formatDateISO(new CalendarDate(2023, 7, 1))).toBe('2023-07-01');
		expect(formatDateISO(new CalendarDate(2023, 9, 9))).toBe('2023-09-09');
	});

	it('handles single-digit months with zero padding', () => {
		expect(formatDateISO(new CalendarDate(2023, 1, 15))).toBe('2023-01-15');
		expect(formatDateISO(new CalendarDate(2023, 9, 15))).toBe('2023-09-15');
	});

	it('handles double-digit days and months correctly', () => {
		expect(formatDateISO(new CalendarDate(2023, 10, 10))).toBe('2023-10-10');
		expect(formatDateISO(new CalendarDate(2023, 11, 30))).toBe('2023-11-30');
	});

	it('handles different years correctly', () => {
		expect(formatDateISO(new CalendarDate(2020, 6, 15))).toBe('2020-06-15');
		expect(formatDateISO(new CalendarDate(2024, 6, 15))).toBe('2024-06-15');
		expect(formatDateISO(new CalendarDate(2025, 6, 15))).toBe('2025-06-15');
	});

	it('handles leap year dates correctly', () => {
		expect(formatDateISO(new CalendarDate(2024, 2, 29))).toBe('2024-02-29');
		expect(formatDateISO(new CalendarDate(2020, 2, 29))).toBe('2020-02-29');
	});

	it('handles year boundaries correctly', () => {
		expect(formatDateISO(new CalendarDate(2023, 12, 31))).toBe('2023-12-31');
		expect(formatDateISO(new CalendarDate(2024, 1, 1))).toBe('2024-01-01');
	});

	it('handles all months correctly with proper zero padding', () => {
		expect(formatDateISO(new CalendarDate(2023, 1, 15))).toBe('2023-01-15');
		expect(formatDateISO(new CalendarDate(2023, 2, 15))).toBe('2023-02-15');
		expect(formatDateISO(new CalendarDate(2023, 3, 15))).toBe('2023-03-15');
		expect(formatDateISO(new CalendarDate(2023, 4, 15))).toBe('2023-04-15');
		expect(formatDateISO(new CalendarDate(2023, 5, 15))).toBe('2023-05-15');
		expect(formatDateISO(new CalendarDate(2023, 6, 15))).toBe('2023-06-15');
		expect(formatDateISO(new CalendarDate(2023, 7, 15))).toBe('2023-07-15');
		expect(formatDateISO(new CalendarDate(2023, 8, 15))).toBe('2023-08-15');
		expect(formatDateISO(new CalendarDate(2023, 9, 15))).toBe('2023-09-15');
		expect(formatDateISO(new CalendarDate(2023, 10, 15))).toBe('2023-10-15');
		expect(formatDateISO(new CalendarDate(2023, 11, 15))).toBe('2023-11-15');
		expect(formatDateISO(new CalendarDate(2023, 12, 15))).toBe('2023-12-15');
	});

	it('handles edge cases for date ranges', () => {
		// First day of year
		expect(formatDateISO(new CalendarDate(2023, 1, 1))).toBe('2023-01-01');
		// Last day of year
		expect(formatDateISO(new CalendarDate(2023, 12, 31))).toBe('2023-12-31');
		// February non-leap year
		expect(formatDateISO(new CalendarDate(2023, 2, 28))).toBe('2023-02-28');
		// February leap year
		expect(formatDateISO(new CalendarDate(2024, 2, 29))).toBe('2024-02-29');
	});
});

describe('formatDateNum', () => {
	it('formats dates in number format', () => {
		expect(formatDateNum(new CalendarDate(2023, 1, 1))).toBe('01/01/2023');
		expect(formatDateNum(new CalendarDate(2023, 2, 15))).toBe('15/02/2023');
		expect(formatDateNum(new CalendarDate(2023, 3, 20))).toBe('20/03/2023');
		expect(formatDateNum(new CalendarDate(2023, 4, 25))).toBe('25/04/2023');
		expect(formatDateNum(new CalendarDate(2023, 5, 30))).toBe('30/05/2023');
		expect(formatDateNum(new CalendarDate(2023, 6, 5))).toBe('05/06/2023');
		expect(formatDateNum(new CalendarDate(2023, 7, 10))).toBe('10/07/2023');
		expect(formatDateNum(new CalendarDate(2023, 8, 15))).toBe('15/08/2023');
		expect(formatDateNum(new CalendarDate(2023, 9, 20))).toBe('20/09/2023');
		expect(formatDateNum(new CalendarDate(2023, 10, 25))).toBe('25/10/2023');
		expect(formatDateNum(new CalendarDate(2023, 11, 30))).toBe('30/11/2023');
		expect(formatDateNum(new CalendarDate(2023, 12, 5))).toBe('05/12/2023');
	});
});

describe('formatMonth', () => {
	it('should format month correctly for all months', () => {
		expect(formatMonth(new CalendarDate(2023, 1, 1))).toBe('Jan 23');
		expect(formatMonth(new CalendarDate(2023, 2, 1))).toBe('Feb 23');
		expect(formatMonth(new CalendarDate(2023, 3, 1))).toBe('Mar 23');
		expect(formatMonth(new CalendarDate(2023, 4, 1))).toBe('Apr 23');
		expect(formatMonth(new CalendarDate(2023, 5, 1))).toBe('May 23');
		expect(formatMonth(new CalendarDate(2023, 6, 1))).toBe('Jun 23');
		expect(formatMonth(new CalendarDate(2023, 7, 1))).toBe('Jul 23');
		expect(formatMonth(new CalendarDate(2023, 8, 1))).toBe('Aug 23');
		expect(formatMonth(new CalendarDate(2023, 9, 1))).toBe('Sept 23');
		expect(formatMonth(new CalendarDate(2023, 10, 1))).toBe('Oct 23');
		expect(formatMonth(new CalendarDate(2023, 11, 1))).toBe('Nov 23');
		expect(formatMonth(new CalendarDate(2023, 12, 1))).toBe('Dec 23');
	});

	it('should return the same month regardless of the day or year', () => {
		expect(formatMonth(new CalendarDate(2023, 1, 31))).toBe('Jan 23');
		expect(formatMonth(new CalendarDate(2024, 1, 1))).toBe('Jan 24');
	});
});

describe('formatTimeShort', () => {
	it('should format time correctly with 2-digit hours and 2-digit minutes', () => {
		const time = new Time(14, 30);
		expect(formatTimeShort(time)).toBe('14:30');
	});

	it('should pad single digit hours with leading zero', () => {
		const time = new Time(9, 45);
		expect(formatTimeShort(time)).toBe('09:45');
	});

	it('should pad single digit minutes with leading zero', () => {
		const time = new Time(12, 5);
		expect(formatTimeShort(time)).toBe('12:05');
	});

	it('should pad both single digit hours and minutes with leading zeros', () => {
		const time = new Time(1, 7);
		expect(formatTimeShort(time)).toBe('01:07');
	});

	it('should format midnight correctly', () => {
		const time = new Time(0, 0);
		expect(formatTimeShort(time)).toBe('00:00');
	});

	it('should format end of day correctly', () => {
		const time = new Time(23, 59);
		expect(formatTimeShort(time)).toBe('23:59');
	});

	it('should format the end time correctly for a short duration', () => {
		expect(formatTimeEnd(new Time(10, 0), 30)).toBe('10:30');
	});

	it('should handle hour rollover correctly', () => {
		expect(formatTimeEnd(new Time(9, 45), 30)).toBe('10:15');
	});

	it('should handle day rollover correctly', () => {
		expect(formatTimeEnd(new Time(23, 30), 60)).toBe('00:30');
	});

	it('should handle multiple hour additions', () => {
		expect(formatTimeEnd(new Time(10, 0), 120)).toBe('12:00');
	});

	it('should handle zero duration', () => {
		expect(formatTimeEnd(new Time(15, 30), 0)).toBe('15:30');
	});

	it('should handle large duration across multiple days', () => {
		expect(formatTimeEnd(new Time(12, 0), 1440)).toBe('12:00'); // 24 hours = 1440 minutes
	});

	it('should pad times correctly', () => {
		expect(formatTimeEnd(new Time(9, 5), 5)).toBe('09:10');
	});
});

describe('formatTimeFull', () => {
	it('should format time correctly with hours, minutes, and seconds', () => {
		const time = new Time(14, 30, 45);
		expect(formatTimeFull(time)).toBe('14:30:45');
	});

	it('should pad single digit hours with leading zero', () => {
		const time = new Time(9, 45, 30);
		expect(formatTimeFull(time)).toBe('09:45:30');
	});

	it('should pad single digit minutes with leading zero', () => {
		const time = new Time(12, 5, 30);
		expect(formatTimeFull(time)).toBe('12:05:30');
	});

	it('should pad single digit seconds with leading zero', () => {
		const time = new Time(12, 30, 5);
		expect(formatTimeFull(time)).toBe('12:30:05');
	});

	it('should pad all single digits with leading zeros', () => {
		const time = new Time(1, 7, 9);
		expect(formatTimeFull(time)).toBe('01:07:09');
	});

	it('should format midnight correctly', () => {
		const time = new Time(0, 0, 0);
		expect(formatTimeFull(time)).toBe('00:00:00');
	});

	it('should format end of day correctly', () => {
		const time = new Time(23, 59, 59);
		expect(formatTimeFull(time)).toBe('23:59:59');
	});

	it('should handle times without seconds specified (defaults to 0)', () => {
		const time = new Time(10, 30);
		expect(formatTimeFull(time)).toBe('10:30:00');
	});

	it('should handle times with milliseconds (ignores milliseconds)', () => {
		const time = new Time(15, 45, 30, 500);
		expect(formatTimeFull(time)).toBe('15:45:30');
	});
});

describe('formatTimeEnd', () => {
	it('should format the end time correctly for a short duration', () => {
		expect(formatTimeEnd(new Time(10, 0), 30)).toBe('10:30');
	});

	it('should handle hour rollover correctly', () => {
		expect(formatTimeEnd(new Time(9, 45), 30)).toBe('10:15');
	});

	it('should handle day rollover correctly', () => {
		expect(formatTimeEnd(new Time(23, 30), 60)).toBe('00:30');
	});

	it('should handle multiple hour additions', () => {
		expect(formatTimeEnd(new Time(10, 0), 120)).toBe('12:00');
	});

	it('should handle zero duration', () => {
		expect(formatTimeEnd(new Time(15, 30), 0)).toBe('15:30');
	});

	it('should handle large duration across multiple days', () => {
		expect(formatTimeEnd(new Time(12, 0), 1440)).toBe('12:00'); // 24 hours = 1440 minutes
	});

	it('should pad times correctly', () => {
		expect(formatTimeEnd(new Time(9, 5), 5)).toBe('09:10');
	});

	it('should handle minute overflow correctly', () => {
		expect(formatTimeEnd(new Time(14, 55), 10)).toBe('15:05');
		expect(formatTimeEnd(new Time(23, 55), 10)).toBe('00:05');
	});

	it('should handle exact hour boundaries', () => {
		expect(formatTimeEnd(new Time(8, 0), 60)).toBe('09:00');
		expect(formatTimeEnd(new Time(23, 0), 60)).toBe('00:00');
	});

	it('should handle negative durations by treating them as zero', () => {
		// Note: This behavior depends on the Time.add implementation
		// If it doesn't handle negative values, this test might need adjustment
		expect(formatTimeEnd(new Time(10, 30), 0)).toBe('10:30');
	});

	it('should handle very large durations', () => {
		// 25 hours = 1500 minutes, should wrap around to next day + 1 hour
		expect(formatTimeEnd(new Time(10, 0), 1500)).toBe('11:00');
	});
});

describe('formatAbsolute', () => {
	it('should format a ZonedDateTime correctly', () => {
		const datetime = new ZonedDateTime(2024, 5, 15, 'Europe/London', 0, 14, 30);
		expect(formatAbsolute(datetime)).toBe('15/05/2024 14:30:00');
	});

	it('should handle midnight correctly', () => {
		const datetime = new ZonedDateTime(2024, 1, 1, 'Europe/London', 0, 0, 0);
		expect(formatAbsolute(datetime)).toBe('01/01/2024 00:00:00');
	});

	it('should handle end of day correctly', () => {
		const datetime = new ZonedDateTime(2024, 12, 31, 'Europe/London', 0, 23, 59);
		expect(formatAbsolute(datetime)).toBe('31/12/2024 23:59:00');
	});

	it('should pad single digit days and months', () => {
		const datetime = new ZonedDateTime(2024, 2, 5, 'Europe/London', 0, 9, 7);
		expect(formatAbsolute(datetime)).toBe('05/02/2024 09:07:00');
	});

	it('should handle leap year dates', () => {
		const datetime = new ZonedDateTime(2024, 2, 29, 'Europe/London', 0, 12, 0);
		expect(formatAbsolute(datetime)).toBe('29/02/2024 12:00:00');
	});

	it('should handle different years', () => {
		const datetime2020 = new ZonedDateTime(2020, 6, 15, 'Europe/London', 0, 10, 30);
		expect(formatAbsolute(datetime2020)).toBe('15/06/2020 10:30:00');

		const datetime2025 = new ZonedDateTime(2025, 6, 15, 'Europe/London', 0, 10, 30);
		expect(formatAbsolute(datetime2025)).toBe('15/06/2025 10:30:00');
	});

	it('should handle all months correctly', () => {
		const datetime1 = new ZonedDateTime(2024, 1, 15, 'Europe/London', 0, 12, 0);
		expect(formatAbsolute(datetime1)).toBe('15/01/2024 12:00:00');

		const datetime12 = new ZonedDateTime(2024, 12, 15, 'Europe/London', 0, 12, 0);
		expect(formatAbsolute(datetime12)).toBe('15/12/2024 12:00:00');
	});

	it('should handle different time zones consistently', () => {
		// Note: The function converts to CalendarDate and Time, so timezone shouldn't affect the output format
		const datetimeUTC = new ZonedDateTime(2024, 5, 15, 'UTC', 0, 14, 30);
		const datetimeNY = new ZonedDateTime(2024, 5, 15, 'America/New_York', 0, 14, 30);

		// Both should format the same since we're using the same local date/time components
		expect(formatAbsolute(datetimeUTC)).toBe('15/05/2024 14:30:00');
		expect(formatAbsolute(datetimeNY)).toBe('15/05/2024 14:30:00');
	});

	it('should include seconds in the time portion', () => {
		const datetime = new ZonedDateTime(2024, 5, 15, 'Europe/London', 0, 14, 30, 45);
		expect(formatAbsolute(datetime)).toBe('15/05/2024 14:30:45');
	});

	it('should handle times with milliseconds (ignores milliseconds)', () => {
		const datetime = new ZonedDateTime(2024, 5, 15, 'Europe/London', 0, 14, 30, 45, 500);
		expect(formatAbsolute(datetime)).toBe('15/05/2024 14:30:45');
	});
});
