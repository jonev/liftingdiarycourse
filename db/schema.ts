import { pgTable, serial, varchar, text, timestamp, integer, numeric, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// EXERCISES TABLE (Predefined Exercise Library)
// ============================================
export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  muscleGroup: varchar('muscle_group', { length: 100 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  nameIdx: index('idx_exercises_name').on(table.name),
}));

// ============================================
// WORKOUTS TABLE (Workout Sessions)
// ============================================
export const workouts = pgTable('workouts', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  date: timestamp('date').notNull(),
  durationMinutes: integer('duration_minutes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  userIdIdx: index('idx_workouts_user_id').on(table.userId),
  userDateIdx: index('idx_workouts_user_date').on(table.userId, table.date.desc()),
}));

// ============================================
// WORKOUT_EXERCISES TABLE (Junction Table)
// ============================================
export const workoutExercises = pgTable('workout_exercises', {
  id: serial('id').primaryKey(),
  workoutId: integer('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: integer('exercise_id').notNull().references(() => exercises.id, { onDelete: 'restrict' }),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  workoutIdIdx: index('idx_workout_exercises_workout_id').on(table.workoutId),
}));

// ============================================
// SETS TABLE (Individual Set Data)
// ============================================
export const sets = pgTable('sets', {
  id: serial('id').primaryKey(),
  workoutExerciseId: integer('workout_exercise_id').notNull().references(() => workoutExercises.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(),
  reps: integer('reps').notNull(),
  weight: numeric('weight', { precision: 6, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  workoutExerciseIdIdx: index('idx_sets_workout_exercise_id').on(table.workoutExerciseId),
}));

// ============================================
// DRIZZLE RELATIONS (for easier querying)
// ============================================

// Exercises relations
export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

// Workouts relations
export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

// WorkoutExercises relations
export const workoutExercisesRelations = relations(workoutExercises, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id],
  }),
  exercise: one(exercises, {
    fields: [workoutExercises.exerciseId],
    references: [exercises.id],
  }),
  sets: many(sets),
}));

// Sets relations
export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [sets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));

// ============================================
// TYPESCRIPT TYPES (for use in application)
// ============================================
export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;

export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;

export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type NewWorkoutExercise = typeof workoutExercises.$inferInsert;

export type Set = typeof sets.$inferSelect;
export type NewSet = typeof sets.$inferInsert;
