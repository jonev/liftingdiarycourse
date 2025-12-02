'use server';

import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { createWorkoutHelper } from '@/data/workouts';
import type { Workout } from '@/db/schema';

const createWorkoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required').max(255, 'Workout name is too long'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  durationMinutes: z.string().optional().transform((val) => {
    if (!val || val === '') return undefined;
    const num = parseInt(val, 10);
    return isNaN(num) ? undefined : num;
  }),
});

interface CreateWorkoutParams {
  name: string;
  date: string;
  durationMinutes?: string;
}

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> | string };

export async function createWorkout(
  params: CreateWorkoutParams
): Promise<ActionResult<Workout>> {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        errors: 'Authentication required',
      };
    }

    // Validate input
    const result = createWorkoutSchema.safeParse(params);

    if (!result.success) {
      return {
        success: false,
        errors: result.error.flatten().fieldErrors,
      };
    }

    // Call data helper
    const workout = await createWorkoutHelper({
      name: result.data.name,
      date: new Date(result.data.date),
      durationMinutes: result.data.durationMinutes,
      userId,
    });

    return {
      success: true,
      data: workout,
    };
  } catch (error) {
    console.error('Failed to create workout:', error);
    return {
      success: false,
      errors: 'Failed to create workout. Please try again.',
    };
  }
}
