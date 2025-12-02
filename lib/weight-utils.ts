/**
 * Weight conversion utilities for lifting diary
 * Handles conversion between pounds (lbs) and kilograms (kg)
 */

// Type definitions
export type WeightUnit = 'lbs' | 'kg';

// Conversion constants (official values)
const LBS_TO_KG = 0.453592; // 1 pound = 0.453592 kilograms
const KG_TO_LBS = 2.20462;  // 1 kilogram = 2.20462 pounds

/**
 * Convert weight between units
 * @param weight - Weight value (string from database or number)
 * @param fromUnit - Source unit ('lbs' or 'kg')
 * @param toUnit - Target unit ('lbs' or 'kg')
 * @returns Converted weight as number
 */
export function convertWeight(
  weight: number | string,
  fromUnit: WeightUnit,
  toUnit: WeightUnit
): number {
  // Convert string to number if needed (database returns numeric as string)
  const numWeight = typeof weight === 'string' ? parseFloat(weight) : weight;

  // Handle invalid input
  if (isNaN(numWeight)) {
    return 0;
  }

  // No conversion needed if units are the same
  if (fromUnit === toUnit) {
    return numWeight;
  }

  // Convert based on direction
  if (fromUnit === 'lbs' && toUnit === 'kg') {
    return numWeight * LBS_TO_KG;
  } else if (fromUnit === 'kg' && toUnit === 'lbs') {
    return numWeight * KG_TO_LBS;
  }

  return numWeight;
}

/**
 * Format weight for display with unit label
 * @param weight - Weight value
 * @param unit - Unit to display ('lbs' or 'kg')
 * @returns Formatted string (e.g., "185.5 lbs")
 */
export function formatWeight(weight: number, unit: WeightUnit): string {
  return `${weight.toFixed(1)} ${unit}`;
}

/**
 * Type guard to validate weight unit from cookie or user input
 * @param value - Value to check
 * @returns True if value is a valid WeightUnit
 */
export function isValidWeightUnit(value: unknown): value is WeightUnit {
  return value === 'lbs' || value === 'kg';
}
