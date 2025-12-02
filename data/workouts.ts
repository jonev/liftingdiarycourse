import { db } from '@/db';
import { workouts, workoutExercises, exercises, sets } from '@/db/schema';
import { eq, and, gte, lt, desc } from 'drizzle-orm';

export interface WorkoutWithDetails {
  id: number;
  name: string;
  date: Date;
  durationMinutes: number | null;
  exercises: {
    id: number;
    name: string;
    muscleGroup: string | null;
    orderIndex: number;
    sets: {
      id: number;
      setNumber: number;
      reps: number;
      weight: string;
    }[];
  }[];
}

/**
 * Fetches all workouts for a specific user on a given date.
 * CRITICAL: Always filters by userId to ensure data isolation.
 */
export async function getWorkoutsByDate(
  userId: string,
  date: Date
): Promise<WorkoutWithDetails[]> {
  // Get start and end of the selected date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // CRITICAL: Always filter by userId to ensure user data isolation
  const workoutData = await db.query.workouts.findMany({
    where: and(
      eq(workouts.userId, userId),
      gte(workouts.date, startOfDay),
      lt(workouts.date, endOfDay)
    ),
    with: {
      workoutExercises: {
        with: {
          exercise: true,
          sets: {
            orderBy: (sets, { asc }) => [asc(sets.setNumber)],
          },
        },
        orderBy: (workoutExercises, { asc }) => [asc(workoutExercises.orderIndex)],
      },
    },
    orderBy: [desc(workouts.date)],
  });

  // Transform the data to match our interface
  return workoutData.map(workout => ({
    id: workout.id,
    name: workout.name,
    date: workout.date,
    durationMinutes: workout.durationMinutes,
    exercises: workout.workoutExercises.map(we => ({
      id: we.exercise.id,
      name: we.exercise.name,
      muscleGroup: we.exercise.muscleGroup,
      orderIndex: we.orderIndex,
      sets: we.sets.map(set => ({
        id: set.id,
        setNumber: set.setNumber,
        reps: set.reps,
        weight: set.weight,
      })),
    })),
  }));
}

/**
 * Creates a new workout for a user.
 * CRITICAL: Always include userId to ensure data isolation.
 */
export async function createWorkoutHelper(data: {
  name: string;
  date: Date;
  durationMinutes?: number;
  userId: string;
}) {
  const [workout] = await db
    .insert(workouts)
    .values({
      name: data.name,
      date: data.date,
      durationMinutes: data.durationMinutes || null,
      userId: data.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return workout;
}
