import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getWorkoutsByDate } from '@/data/workouts';
import { DatePicker } from './date-picker';
import { formatDate } from '@/lib/date-utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Pencil, Plus } from 'lucide-react';
import { getWeightUnitPreference } from '@/lib/weight-preference';
import { convertWeight } from '@/lib/weight-utils';
import { UnitSelector } from './unit-selector';

interface DashboardPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  // 1. Authenticate the user
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  // 2. Get user's weight unit preference
  const unit = await getWeightUnitPreference();

  // 3. Get date from URL search params or default to today
  const params = await searchParams;
  const dateParam = params.date;

  // Parse date in local timezone to avoid UTC conversion issues
  let selectedDate: Date;
  if (dateParam) {
    const [year, month, day] = dateParam.split('-').map(Number);
    selectedDate = new Date(year, month - 1, day); // month is 0-indexed
  } else {
    selectedDate = new Date();
  }

  // 3. Fetch data in Server Component
  const workouts = await getWorkoutsByDate(userId, selectedDate);

  // 4. Helper function for formatting duration
  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // 5. Render everything in Server Component
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header with Dashboard title, Date Picker, and Unit Selector */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2 min-w-[300px]">
              <span className="text-sm font-medium">Select date</span>
              <DatePicker selectedDate={selectedDate} />
            </div>
            <UnitSelector initialUnit={unit} />
          </div>
        </div>

        {/* Main Workouts Section */}
        <Card className="min-h-[500px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Workouts</CardTitle>
              <Button asChild size="sm">
                <Link href="/dashboard/workout/new">
                  <Plus className="h-4 w-4" />
                  Create Workout
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* No Workouts */}
            {workouts.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No workouts logged for {formatDate(selectedDate)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start tracking your fitness journey!
                </p>
              </div>
            )}

            {/* Workouts List */}
            {workouts.length > 0 && (
              <div className="space-y-6">
                {workouts.map((workout) => (
                  <div key={workout.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold">{workout.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {workout.durationMinutes && (
                            <>
                              <Clock className="h-4 w-4" />
                              <span>{formatDuration(workout.durationMinutes)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/dashboard/workout/${workout.id}`}
                        className="rounded-md p-2 hover:bg-muted transition-colors"
                        aria-label="Edit workout"
                      >
                        <Pencil className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                      </Link>
                    </div>

                    <div className="space-y-6">
                      {workout.exercises.map((exercise, idx) => (
                        <div key={exercise.id} className="space-y-3">
                          {/* Exercise Header */}
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                              {idx + 1}
                            </span>
                            <div>
                              <h4 className="font-semibold text-lg">{exercise.name}</h4>
                              {exercise.muscleGroup && (
                                <p className="text-sm text-muted-foreground">
                                  {exercise.muscleGroup}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Sets Table */}
                          <div className="ml-11">
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                                      Set
                                    </th>
                                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                                      Reps
                                    </th>
                                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                                      Weight ({unit})
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {exercise.sets.map((set) => (
                                    <tr key={set.id} className="border-b last:border-0">
                                      <td className="py-2 px-3">{set.setNumber}</td>
                                      <td className="py-2 px-3 font-medium">{set.reps}</td>
                                      <td className="py-2 px-3 font-medium">
                                        {convertWeight(set.weight, 'lbs', unit).toFixed(1)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
