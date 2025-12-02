'use client';

import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/date-utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  selectedDate: Date;
}

/**
 * Small client component that only handles date picker interactivity.
 * Updates URL search params which triggers server-side re-render.
 */
export function DatePicker({ selectedDate }: DatePickerProps) {
  const router = useRouter();

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;

    // Format date in local timezone to avoid UTC conversion issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    router.push(`/dashboard?date=${dateStr}`);
  };

  return (
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
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
