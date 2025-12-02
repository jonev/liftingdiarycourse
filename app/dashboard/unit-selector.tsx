'use client';

/**
 * Unit selector component for weight unit preference
 * Allows users to toggle between lbs and kg
 */

import { useState, useTransition } from 'react';
import { setWeightUnitPreference } from './actions';
import { type WeightUnit } from '@/lib/weight-utils';

interface UnitSelectorProps {
  initialUnit: WeightUnit;
}

export function UnitSelector({ initialUnit }: UnitSelectorProps) {
  const [isPending, startTransition] = useTransition();
  const [unit, setUnit] = useState<WeightUnit>(initialUnit);

  const handleChange = (newUnit: WeightUnit) => {
    setUnit(newUnit);
    startTransition(async () => {
      await setWeightUnitPreference(newUnit);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Unit:</span>
      <div className="flex rounded-lg border border-input bg-background">
        <button
          onClick={() => handleChange('lbs')}
          disabled={isPending}
          className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-l-lg ${
            unit === 'lbs'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          lbs
        </button>
        <button
          onClick={() => handleChange('kg')}
          disabled={isPending}
          className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-r-lg border-l ${
            unit === 'kg'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          kg
        </button>
      </div>
    </div>
  );
}
