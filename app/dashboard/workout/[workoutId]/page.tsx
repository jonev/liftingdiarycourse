import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getWorkoutById } from '@/data/workouts';
import { EditWorkoutForm } from './edit-workout-form';

interface PageProps {
  params: Promise<{
    workoutId: string;
  }>;
}

export default async function EditWorkoutPage({ params }: PageProps) {
  // Authenticate the user
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get workoutId from params
  const { workoutId } = await params;
  const workoutIdNum = parseInt(workoutId, 10);

  if (isNaN(workoutIdNum)) {
    redirect('/dashboard');
  }

  // Fetch the workout data
  const workout = await getWorkoutById(workoutIdNum, userId);

  if (!workout) {
    redirect('/dashboard');
  }

  // Pass data to client component
  return <EditWorkoutForm workout={workout} />;
}
