'use server';

/**
 * Server actions for dashboard operations
 * Handles user preference mutations
 */

import { revalidatePath } from 'next/cache';
import { setWeightUnitPreferenceCookie } from '@/lib/weight-preference';
import { type WeightUnit } from '@/lib/weight-utils';

/**
 * Set user's weight unit preference
 * Updates cookie and revalidates dashboard to re-render with new unit
 * @param unit - Weight unit to set ('lbs' or 'kg')
 * @returns Success status
 */
export async function setWeightUnitPreference(unit: WeightUnit) {
  await setWeightUnitPreferenceCookie(unit);
  revalidatePath('/dashboard');
  return { success: true };
}
