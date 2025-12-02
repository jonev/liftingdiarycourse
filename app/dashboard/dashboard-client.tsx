'use client';

import { useState, useEffect } from 'react';
import { getWorkoutsByDate, type WorkoutWithDetails } from '@/app/actions/workouts';
import { formatDate } from '@/lib/date-utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Clock } from 'lucide-react';

export function DashboardClient() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [workouts, setWorkouts] = useState<WorkoutWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkouts() {
      setLoading(true);
      try {
        const data = await getWorkoutsByDate(selectedDate);
        setWorkouts(data);
      } catch (error) {
        console.error('Failed to load workouts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadWorkouts();
  }, [selectedDate]);

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your workout progress and view your training history.
          </p>
        </div>

        {/* Date Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDate(selectedDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
              <p className="mt-4 text-muted-foreground">Loading workouts...</p>
            </CardContent>
          </Card>
        )}

        {/* No Workouts */}
        {!loading && workouts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No workouts logged for {formatDate(selectedDate)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Start tracking your fitness journey!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Workouts List */}
        {!loading && workouts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                Workouts for {formatDate(selectedDate)}
              </h2>
            </div>

            <div className="space-y-6">
              {workouts.map((workout) => (
                <Card key={workout.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle>{workout.name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {workout.durationMinutes && (
                            <>
                              <Clock className="h-4 w-4" />
                              <span>{formatDuration(workout.durationMinutes)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {workout.exercises.map((exercise, idx) => (
                      <div key={exercise.id} className="space-y-3">
                        {/* Exercise Header */}
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                            {idx + 1}
                          </span>
                          <div>
                            <h3 className="font-semibold text-lg">{exercise.name}</h3>
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
                                    Weight (lbs)
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {exercise.sets.map((set) => (
                                  <tr key={set.id} className="border-b last:border-0">
                                    <td className="py-2 px-3">{set.setNumber}</td>
                                    <td className="py-2 px-3 font-medium">{set.reps}</td>
                                    <td className="py-2 px-3 font-medium">
                                      {parseFloat(set.weight).toFixed(1)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
