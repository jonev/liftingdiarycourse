/**
 * Cookie-based weight unit preference management
 * Stores user's preferred weight unit (lbs or kg) in a cookie
 */

import { cookies } from 'next/headers';
import { type WeightUnit, isValidWeightUnit } from './weight-utils';

const COOKIE_NAME = 'weight-unit';
const DEFAULT_UNIT: WeightUnit = 'lbs';

/**
 * Get weight unit preference from cookie (server-side only)
 * @returns User's preferred weight unit ('lbs' or 'kg')
 * @default 'lbs' if cookie not set or invalid
 */
export async function getWeightUnitPreference(): Promise<WeightUnit> {
  const cookieStore = await cookies();
  const unit = cookieStore.get(COOKIE_NAME)?.value;

  // Validate cookie value
  if (isValidWeightUnit(unit)) {
    return unit;
  }

  // Return default if missing or invalid
  return DEFAULT_UNIT;
}

/**
 * Set weight unit preference cookie (server-side only)
 * @param unit - Weight unit to store ('lbs' or 'kg')
 */
export async function setWeightUnitPreferenceCookie(unit: WeightUnit): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, unit, {
    path: '/',                        // Available across entire site
    maxAge: 60 * 60 * 24 * 365,      // 1 year expiration
    sameSite: 'lax',                 // CSRF protection
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  });
}
