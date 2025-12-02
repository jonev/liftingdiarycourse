import { format, parseISO, isValid } from 'date-fns';

/**
 * Format a date in the standard format: "1st Sep 2025"
 *
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "1st Sep 2025")
 * @throws Error if date is invalid
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    throw new Error('Invalid date provided');
  }

  return format(dateObj, 'do MMM yyyy');
}

/**
 * Format a date with day of week: "Monday, 1st Sep 2025"
 *
 * @param date - Date object or ISO string
 * @returns Formatted date string with day of week
 * @throws Error if date is invalid
 */
export function formatDateLong(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    throw new Error('Invalid date provided');
  }

  return format(dateObj, 'EEEE, do MMM yyyy');
}

/**
 * Format time only: "14:30"
 *
 * @param date - Date object or ISO string
 * @returns Formatted time string (24-hour format)
 * @throws Error if date is invalid
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    throw new Error('Invalid date provided');
  }

  return format(dateObj, 'HH:mm');
}

/**
 * Format date and time: "1st Sep 2025, 14:30"
 *
 * @param date - Date object or ISO string
 * @returns Formatted date and time string
 * @throws Error if date is invalid
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    throw new Error('Invalid date provided');
  }

  return format(dateObj, 'do MMM yyyy, HH:mm');
}

/**
 * Format date for database/API: "2025-09-01"
 *
 * @param date - Date object or ISO string
 * @returns ISO date string (YYYY-MM-DD)
 * @throws Error if date is invalid
 */
export function formatDateISO(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    throw new Error('Invalid date provided');
  }

  return format(dateObj, 'yyyy-MM-dd');
}
