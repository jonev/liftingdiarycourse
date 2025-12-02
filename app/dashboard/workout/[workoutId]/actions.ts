'use server';

import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { updateWorkoutHelper } from '@/data/workouts';
import type { Workout } from '@/db/schema';

const updateWorkoutSchema = z.object({
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

interface UpdateWorkoutParams {
  workoutId: number;
  name: string;
  date: string;
  durationMinutes?: string;
}

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> | string };

export async function updateWorkout(
  params: UpdateWorkoutParams
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
    const result = updateWorkoutSchema.safeParse(params);

    if (!result.success) {
      return {
        success: false,
        errors: result.error.flatten().fieldErrors,
      };
    }

    // Call data helper
    const workout = await updateWorkoutHelper(
      params.workoutId,
      userId,
      {
        name: result.data.name,
        date: new Date(result.data.date),
        durationMinutes: result.data.durationMinutes,
      }
    );

    if (!workout) {
      return {
        success: false,
        errors: 'Workout not found or you do not have permission to edit it',
      };
    }

    return {
      success: true,
      data: workout,
    };
  } catch (error) {
    console.error('Failed to update workout:', error);
    return {
      success: false,
      errors: 'Failed to update workout. Please try again.',
    };
  }
}
