import 'dotenv/config';
import { db } from './index';
import { exercises } from './schema';

const initialExercises = [
  { name: 'Bench Press', muscleGroup: 'Chest', description: 'Barbell bench press' },
  { name: 'Squat', muscleGroup: 'Legs', description: 'Barbell back squat' },
  { name: 'Deadlift', muscleGroup: 'Back', description: 'Conventional deadlift' },
  { name: 'Overhead Press', muscleGroup: 'Shoulders', description: 'Standing barbell press' },
  { name: 'Barbell Row', muscleGroup: 'Back', description: 'Bent-over barbell row' },
  { name: 'Pull-ups', muscleGroup: 'Back', description: 'Bodyweight pull-ups' },
  { name: 'Dips', muscleGroup: 'Chest', description: 'Bodyweight or weighted dips' },
  { name: 'Romanian Deadlift', muscleGroup: 'Hamstrings', description: 'RDL variation' },
  { name: 'Leg Press', muscleGroup: 'Legs', description: 'Machine leg press' },
  { name: 'Lat Pulldown', muscleGroup: 'Back', description: 'Cable lat pulldown' },
];

async function seed() {
  console.log('Seeding exercises...');

  await db.insert(exercises).values(initialExercises).onConflictDoNothing();

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
