'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { updateWorkout } from './actions';
import { format } from 'date-fns';
import type { Workout } from '@/db/schema';

interface EditWorkoutFormProps {
  workout: Workout;
}

export function EditWorkoutForm({ workout }: EditWorkoutFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string>('');

  // Format the workout date for the date input (YYYY-MM-DD)
  const workoutDate = format(new Date(workout.date), 'yyyy-MM-dd');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setGeneralError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      workoutId: workout.id,
      name: formData.get('name') as string,
      date: formData.get('date') as string,
      durationMinutes: formData.get('durationMinutes') as string,
    };

    const result = await updateWorkout(data);

    if (result.success) {
      // Navigate to dashboard on success
      router.push('/dashboard');
    } else {
      setIsSubmitting(false);
      if (typeof result.errors === 'string') {
        setGeneralError(result.errors);
      } else {
        setErrors(result.errors);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight">Edit Workout</h1>
          <p className="text-muted-foreground">
            Update your workout details and save your changes.
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Workout Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* General Error Message */}
              {generalError && (
                <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                  {generalError}
                </div>
              )}

              {/* Workout Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Workout Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={workout.name}
                  placeholder="e.g., Chest Day, Leg Day"
                  required
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name[0]}</p>
                )}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={workoutDate}
                  required
                  disabled={isSubmitting}
                />
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date[0]}</p>
                )}
              </div>

              {/* Duration (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                <Input
                  id="durationMinutes"
                  name="durationMinutes"
                  type="number"
                  defaultValue={workout.durationMinutes ?? ''}
                  placeholder="e.g., 60"
                  min="1"
                  disabled={isSubmitting}
                />
                {errors.durationMinutes && (
                  <p className="text-sm text-destructive">
                    {errors.durationMinutes[0]}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Optional: Add the total duration of your workout
                </p>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
